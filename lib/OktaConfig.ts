export const oktaConfig = {
    clientId: '0oa7lb6bybpUwiuvR5d7',
    issuer: 'https://dev-45271402.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}