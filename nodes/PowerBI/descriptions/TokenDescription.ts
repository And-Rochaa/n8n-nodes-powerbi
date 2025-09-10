import { INodeProperties } from 'n8n-workflow';

export const tokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
			},
		},
		options: [
			{
				name: 'Generate Auth URL',
				value: 'generateAuthUrl',
				description: 'Generate OAuth2 authentication URL for Microsoft Entra ID',
				action: 'Generate authentication URL',
			},
			{
				name: 'Get Token',
				value: 'getToken',
				description: 'Get an access token using an authorization code',
				action: 'Get access token',
			},
			{
				name: 'Get Service Principal Token',
				value: 'getServicePrincipalToken',
				description: 'Get an access token using Service Principal credentials',
				action: 'Get service principal token',
			},
			{
				name: 'Refresh Token',
				value: 'refreshToken',
				description: 'Refresh an access token using a refresh token',
				action: 'Refresh access token',
			},
		],
		default: 'generateAuthUrl',
	},
];

export const tokenFields: INodeProperties[] = [
	// Fields for generateAuthUrl operation in token resource
	{
		displayName: 'Authorization URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
		description: 'Base URL for Microsoft Entra ID authorization endpoint',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: '',
		description: 'Application client ID registered in Microsoft Entra ID',
	},
	{
		displayName: 'Response Type',
		name: 'responseType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: 'code',
		description: 'The type of response expected from the authorization endpoint',
	},
	{
		displayName: 'Redirect URI',
		name: 'redirectUri',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: '',
		description: 'The URI where the authorization response will be sent',
	},
	{
		displayName: 'Response Mode',
		name: 'responseMode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: 'query',
		description: 'Specifies how the authorization response should be returned',
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: 'openid',
		description: 'Space-separated list of scopes that you want the user to consent to',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'generateAuthUrl',
				],
			},
		},
		default: '',
		description: 'A value included in the request that is also returned in the token response to prevent cross-site request forgery attacks',
	},
	
	// Fields for getToken operation in token resource
	{
		displayName: 'Token URL',
		name: 'tokenUrl',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
		description: 'URL for Microsoft Entra ID token endpoint',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: '',
		description: 'Application client ID registered in Microsoft Entra ID',
	},
	{
		displayName: 'Client Secret',
		name: 'clientSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: '',
		description: 'Secret key of application registered in Microsoft Entra ID',
	},
	{
		displayName: 'Authorization Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: '',
		description: 'Authorization code received from the authorization endpoint',
	},
	{
		displayName: 'Redirect URI',
		name: 'redirectUri',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: '',
		description: 'The same redirect URI used in the authorization request',
	},
	{
		displayName: 'Grant Type',
		name: 'grantType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: 'authorization_code',
		description: 'The type of grant used in OAuth2 flow',
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getToken',
				],
			},
		},
		default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
		description: 'Space-separated list of scopes that you want access to',
	},
	
	// Fields for refreshToken operation in token resource
	{
		displayName: 'Token URL',
		name: 'tokenUrl',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
		description: 'URL for Microsoft Entra ID token endpoint',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: '',
		description: 'Application client ID registered in Microsoft Entra ID',
	},
	{
		displayName: 'Client Secret',
		name: 'clientSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: '',
		description: 'Secret key of application registered in Microsoft Entra ID',
	},
	{
		displayName: 'Refresh Token',
		name: 'refreshToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: '',
		description: 'Refresh token received from a previous token response',
	},
	{
		displayName: 'Redirect URI',
		name: 'redirectUri',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: '',
		description: 'The same redirect URI used in the authorization request',
	},
	{
		displayName: 'Grant Type',
		name: 'grantType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: 'refresh_token',
		description: 'The type of grant used in OAuth2 flow',
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'refreshToken',
				],
			},
		},
		default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
		description: 'Space-separated list of scopes that you want access to',
	},
	
	// Fields for getServicePrincipalToken operation
	{
		displayName: 'Tenant ID',
		name: 'tenantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getServicePrincipalToken',
				],
			},
		},
		default: '',
		description: 'Microsoft Entra ID (formerly Azure AD) tenant ID',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getServicePrincipalToken',
				],
			},
		},
		default: '',
		description: 'Application ID registered in Microsoft Entra ID',
	},
	{
		displayName: 'Client Secret',
		name: 'clientSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getServicePrincipalToken',
				],
			},
		},
		default: '',
		description: 'Secret key of application registered in Microsoft Entra ID',
	},
	{
		displayName: 'API Resource',
		name: 'apiResource',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getServicePrincipalToken',
				],
			},
		},
		default: 'https://analysis.windows.net/powerbi/api',
		description: 'The resource you want to get access to',
	},
	{
		displayName: 'Grant Type',
		name: 'grantType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'token',
				],
				operation: [
					'getServicePrincipalToken',
				],
			},
		},
		default: 'client_credentials',
		description: 'The grant type used in OAuth2 flow',
	},
];