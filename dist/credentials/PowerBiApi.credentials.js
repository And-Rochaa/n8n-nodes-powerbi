"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBiApi = void 0;
class PowerBiApi {
    constructor() {
        this.name = 'powerBiApi';
        this.displayName = 'Power BI API';
        this.documentationUrl = 'https://docs.microsoft.com/en-us/rest/api/power-bi/';
        this.icon = 'file:powerbi.svg';
        this.properties = [
            {
                displayName: 'Bearer Token',
                name: 'bearerToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Bearer token for Power BI API authentication',
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
    async authenticate(credentials, requestOptions) {
        const { bearerToken } = credentials;
        requestOptions.headers.Authorization = `Bearer ${bearerToken}`;
        return requestOptions;
    }
}
exports.PowerBiApi = PowerBiApi;
//# sourceMappingURL=PowerBiApi.credentials.js.map