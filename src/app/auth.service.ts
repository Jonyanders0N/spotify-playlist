import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AccessToken } from './shared/models/accessToken.model';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = environment.spotifyClientId;
  private redirectUri = 'http://localhost:4200/callback';
  private scopes = 'user-read-private user-read-email'; // Adjust scopes as needed

  constructor(private http: HttpClient) {}

  // Generates a random code verifier string
  generateCodeVerifier(length: number = 128): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Generates a code challenge from the code verifier using SHA-256 and Base64URL encoding
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  // Helper function to Base64URL-encode the hash
  base64UrlEncode(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Creates the PKCE challenge and stores the code verifier for later use
  async generatePKCEChallenge(): Promise<string> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    // Store the code verifier (e.g., in session storage) to use during token exchange
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    return codeChallenge;
  }

  async redirectToSpotifyAuth(): Promise<void> {
    const codeChallenge = await this.generatePKCEChallenge();
    const authUrl = `https://accounts.spotify.com/authorize` +
      `?client_id=${this.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&scope=${encodeURIComponent(this.scopes)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;
    window.location.href = authUrl;
  }

    // Call this method once your app receives the authorization code from the URL
    exchangeToken(authCode: string): Observable<AccessToken> {
      const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
      const body = new HttpParams()
        .set('client_id', this.clientId)
        .set('grant_type', 'authorization_code')
        .set('code', authCode)
        .set('redirect_uri', this.redirectUri)
        .set('code_verifier', codeVerifier || '');
      
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      
      return this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers })
      .pipe(
        tap((res: any) => {
          localStorage.setItem('access_token', res.access_token);
        })
      );


    }
}
