import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, tap } from 'rxjs';
import { ArtistSearchResponse } from './shared/models/spotify-api.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor() { }
  
  httpClient = inject(HttpClient);

  getArtist(artist: string): Observable<ArtistSearchResponse>{
    const access_token = localStorage.getItem('access_token');
    const body = new HttpParams()
      .set('q', artist)
      .set('type', 'artist')
      // .set('market', 'ES')
      // .set('limit', '10')
      // .set('offset', '5') 
    const headers = new HttpHeaders({'Authorization': `Bearer ${access_token}`})

    return this.httpClient.get<ArtistSearchResponse>(`https://api.spotify.com/v1/search/?q=${artist}&type=artist`, {headers})
      .pipe(
        tap((res: any) => {
          console.log(res);
        }))
  }
}
