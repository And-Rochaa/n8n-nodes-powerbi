import { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'group',
				],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all groups (workspaces)',
				action: 'List a group',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific group',
				action: 'Get a group',
			},
			{
				name: 'Get Reports',
				value: 'getReports',
				description: 'Get reports from a group',
				action: 'Get reports from a group',
			},
			{
				name: 'Get Dashboards',
				value: 'getDashboards',
				description: 'Get dashboards from a group',
				action: 'Get dashboards from a group',
			},
			{
				name: 'Get Datasets',
				value: 'getDatasets',
				description: 'Get datasets from a group',
				action: 'Get datasets from a group',
			},
		],
		default: 'list',
	},
];

export const groupFields: INodeProperties[] = [
	// Fields for get, getReports, getDashboards and getDatasets operations
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: [
					'group',
				],
				operation: [
					'get',
					'getReports',
					'getDashboards',
					'getDatasets',
				],
			},
		},
		default: '',
		description: 'Power BI group (workspace). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
