export interface AccessToken {
    readonly access_token: string;
    expires_in?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
}