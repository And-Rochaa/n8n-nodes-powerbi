import { INodeProperties } from 'n8n-workflow';

export const dashboardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'dashboard',
				],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all dashboards',
				action: 'List a dashboard',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific dashboard',
				action: 'Get a dashboard',
			},
			{
				name: 'Get Tiles',
				value: 'getTiles',
				description: 'Get tiles from a dashboard',
				action: 'Get tiles from a dashboard',
			},
		],
		default: 'list',
	},
];

export const dashboardFields: INodeProperties[] = [	// Field to select group (workspace)
	{
		displayName: 'Group (Workspace) Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		default: '',
		description: 'Power BI group (workspace) ID. Leave blank to use "My Workspace". Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: [
					'dashboard',
				],
				operation: [
					'list',
					'get',
					'getTiles',
				],
			},
		},
	},	// Fields for get and getTiles operations
	{
		displayName: 'Dashboard Name or ID',
		name: 'dashboardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDashboards',
			loadOptionsDependsOn: ['groupId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'dashboard',
				],
				operation: [
					'get',
					'getTiles',
				],
			},
		},
		default: '',
		description: 'ID of the dashboard to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
