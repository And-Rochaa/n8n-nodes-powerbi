import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PowerBI implements ICredentialType {
	name = 'powerBI';
	displayName = 'Power BI';
	documentationUrl = 'powerbi';
	extends = ['oAuth2Api'];
	icon = 'file:powerbi.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
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
			type: 'hidden',
			default: 'response_type=code&prompt=consent',
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
			default: 'access_token',
		},
		{
			displayName: 'Refresh Token Key',
			name: 'refreshTokenKey',
			type: 'hidden',
			default: 'refresh_token',
		},
	];

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
