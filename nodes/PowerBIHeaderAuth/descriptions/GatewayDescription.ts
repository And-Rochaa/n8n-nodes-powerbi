import { INodeProperties } from 'n8n-workflow';

export const gatewayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'gateway',
				],
			},
		},
		options: [
			{
				name: 'Get Datasource',
				value: 'getDatasource',
				description: 'Returns the specified datasource from the specified gateway',
				action: 'Get datasource',
			},
			{
				name: 'Get Datasource Status',
				value: 'getDatasourceStatus',
				description: 'Checks the connectivity status of the specified datasource',
				action: 'Get datasource status',
			},
			{
				name: 'Get Datasources',
				value: 'getDatasources',
				description: 'Returns a list of datasources from the specified gateway',
				action: 'Get gateway datasources',
			},
			{
				name: 'Get Datasource Users',
				value: 'getDatasourceUsers',
				description: 'Returns a list of users who have access to the specified datasource',
				action: 'Get datasource users',
			},
			{
				name: 'Get Gateway',
				value: 'get',
				description: 'Returns the specified gateway',
				action: 'Get gateway',
			},
			{
				name: 'List Gateways',
				value: 'list',
				description: 'Returns a list of gateways for which the user is an administrator',
				action: 'List gateways',
			},
		],
		default: 'list',
	},
];

export const gatewayFields: INodeProperties[] = [
	// Gateway ID field for getDatasource operation
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGateways',
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasource'],
			},
		},
		default: '',
		required: true,
		description: 'The gateway that contains the datasource. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Datasource ID field for getDatasource operation
	{
		displayName: 'Datasource Name or ID',
		name: 'datasourceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDatasources',
			loadOptionsDependsOn: ['gatewayId'],
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasource'],
			},
		},
		default: '',
		required: true,
		description: 'The datasource to be retrieved. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Gateway ID field for getDatasourceStatus operation
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGateways',
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasourceStatus'],
			},
		},
		default: '',
		required: true,
		description: 'The gateway that contains the datasource. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Datasource ID field for getDatasourceStatus operation
	{
		displayName: 'Datasource Name or ID',
		name: 'datasourceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDatasources',
			loadOptionsDependsOn: ['gatewayId'],
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasourceStatus'],
			},
		},
		default: '',
		required: true,
		description: 'The datasource to check status for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Gateway ID field for getDatasources operation
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGateways',
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasources'],
			},
		},
		default: '',
		required: true,
		description: 'The gateway to get datasources from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Gateway ID field for getDatasourceUsers operation
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGateways',
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasourceUsers'],
			},
		},
		default: '',
		required: true,
		description: 'The gateway that contains the datasource. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Datasource ID field for getDatasourceUsers operation
	{
		displayName: 'Datasource Name or ID',
		name: 'datasourceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDatasources',
			loadOptionsDependsOn: ['gatewayId'],
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['getDatasourceUsers'],
			},
		},
		default: '',
		required: true,
		description: 'The datasource to get users for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Gateway ID field for get operation
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGateways',
		},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The gateway to be retrieved. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
