import type {
    ICredentialDataDecryptedObject,
    ICredentialTestRequest,
    ICredentialType,
    IHttpRequestOptions,
    INodeProperties,
} from 'n8n-workflow';

export class PowerBiApi implements ICredentialType {
    name = 'powerBiApi';
    displayName = 'Power BI API';
    documentationUrl = 'https://docs.microsoft.com/en-us/rest/api/power-bi/';
    icon = 'file:powerbi.svg';
    properties: INodeProperties[] = [
        {
            displayName: 'Bearer Token',
            name: 'bearerToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Bearer token for Power BI API authentication',
        },
    ];

    async authenticate(
        credentials: ICredentialDataDecryptedObject,
        requestOptions: IHttpRequestOptions,
    ): Promise<IHttpRequestOptions> {
        const { bearerToken } = credentials as { bearerToken: string };
        requestOptions.headers!.Authorization = `Bearer ${bearerToken}`;
        return requestOptions;
    }

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.powerbi.com/v1.0/myorg',
            url: '/groups',
            headers: {
                Accept: 'application/json',
            },
        },
    };
}