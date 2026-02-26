"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBiApiOAuth2Api = void 0;
class PowerBiApiOAuth2Api {
    constructor() {
        this.name = 'powerBiApiOAuth2Api';
        this.extends = ['oAuth2Api'];
        this.displayName = 'Power BI OAuth2 API';
        this.documentationUrl = 'https://docs.microsoft.com/en-us/rest/api/power-bi/';
        this.icon = 'file:powerbi.svg';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'string',
                default: '',
                placeholder: 'prompt=consent',
                description: 'Additional query parameters for the authorization URL. Use "prompt=consent" to force consent screen for admin approval, or leave empty for default behavior (recommended for regular users).',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'body',
            },
            {
                displayName: 'Token Key',
                name: 'tokenKey',
                type: 'hidden',
                typeOptions: { password: true },
                default: 'access_token',
            },
            {
                displayName: 'Refresh Token Key',
                name: 'refreshTokenKey',
                type: 'hidden',
                typeOptions: { password: true },
                default: 'refresh_token',
            },
        ];
        this.test = {
            request: {
                baseURL: 'https://api.powerbi.com/v1.0/myorg',
                url: '/groups',
                headers: {
                    Accept: 'application/json',
                },
            },
        };
    }
}
exports.PowerBiApiOAuth2Api = PowerBiApiOAuth2Api;
//# sourceMappingURL=PowerBiApiOAuth2Api.credentials.js.map