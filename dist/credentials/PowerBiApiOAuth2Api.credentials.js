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
                type: 'options',
                options: [
                    {
                        name: 'Authorization Code (Delegated / Interactive)',
                        value: 'authorizationCode',
                    },
                    {
                        name: 'Client Credentials (Service Principal)',
                        value: 'clientCredentials',
                    },
                ],
                default: 'authorizationCode',
                description: 'Authorization Code requires a user to sign in once (delegated access). Client Credentials uses your app registration alone (app-only / Service Principal access) and needs Application permissions with admin consent in Entra ID.',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                description: 'Not used for Client Credentials. Replace "common" with your Tenant ID if your app registration is single-tenant.',
                displayOptions: {
                    show: {
                        grantType: ['authorizationCode'],
                    },
                },
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'string',
                default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                description: 'For Client Credentials, "common" does NOT work: replace it with your Tenant ID, e.g. https://login.microsoftonline.com/<your-tenant-id>/oauth2/v2.0/token',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'string',
                default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
                description: 'For Client Credentials, remove "offline_access" (there is no refresh token in this flow): use just https://analysis.windows.net/powerbi/api/.default',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'string',
                default: '',
                placeholder: 'prompt=consent',
                description: 'Additional query parameters for the authorization URL. Use "prompt=consent" to force consent screen for admin approval, or leave empty for default behavior (recommended for regular users).',
                displayOptions: {
                    show: {
                        grantType: ['authorizationCode'],
                    },
                },
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
                displayOptions: {
                    show: {
                        grantType: ['authorizationCode'],
                    },
                },
            },
            {
                displayName: 'Token Expired Status Code',
                name: 'tokenExpiredStatusCode',
                type: 'number',
                typeOptions: { password: true },
                default: 403,
                description: 'HTTP status code that indicates the token has expired. Power BI returns 403 instead of the standard 401.',
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