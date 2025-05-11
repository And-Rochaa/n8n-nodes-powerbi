import { INodeProperties } from 'n8n-workflow';

export const datasetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all datasets',
				action: 'List a dataset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific dataset',
				action: 'Get a dataset',
			},
			{
				name: 'Refresh',
				value: 'refresh',
				description: 'Refresh a dataset',
				action: 'Refresh a dataset',
			},
			{
				name: 'Get Tables',
				value: 'getTables',
				description: 'Get tables from a dataset',
				action: 'Get tables from a dataset',
			},
			{				name: 'Add Rows',
				value: 'addRows',
				description: 'Add rows to a table',
				action: 'Add rows to a dataset',
			},
			{
				name: 'Execute Queries',
				value: 'executeQueries',
				description: 'Execute DAX queries on a dataset',
				action: 'Execute DAX queries on a dataset',
			},
			{
				name: 'Get Refresh History',
				value: 'getRefreshHistory',
				description: 'Get the refresh history of a dataset',
				action: 'Get refresh history of a dataset',
			},
		],
		default: 'list',
	},
];

export const datasetFields: INodeProperties[] = [	// Field to select the group (workspace)
	{
		displayName: 'Group (Workspace)',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		default: '',
		description: 'Power BI group (workspace) ID. Leave blank to use "My Workspace".',
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'list',
					'get',
					'refresh',
					'getTables',
					'addRows',
					'executeQueries',
					'getRefreshHistory',
				],
			},
		},
	},	// Fields for get, refresh, getTables, addRows, executeQueries, getRefreshHistory operations
	{
		displayName: 'Dataset',
		name: 'datasetId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDatasets',
			loadOptionsDependsOn: ['groupId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'get',
					'refresh',
					'getTables',
					'addRows',
					'executeQueries',
					'getRefreshHistory',
				],
			},
		},
		default: '',
		description: 'ID of the dataset to be retrieved',
	},	// Field for addRows operation
	{
		displayName: 'Table Name',
		name: 'tableName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTables',
			loadOptionsDependsOn: ['groupId', 'datasetId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'addRows',
				],
			},
		},
		default: '',
		description: 'Name of the table to add rows to',
	},{
		displayName: 'Data',
		name: 'data',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'addRows',
				],
			},
		},		default: '',
		description: 'The data to be added to the table (JSON format)',
	},	{
		displayName: 'DAX Query',
		name: 'daxQuery',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'executeQueries',
				],
			},
		},
		default: '',
		placeholder: 'EVALUATE VALUES(MyMainTable)',
		description: 'DAX query to be executed on the dataset',
	},	// Field for getRefreshHistory operation
	{
		displayName: 'Limit',
		name: 'top',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: [
					'dataset',
				],
				operation: [
					'getRefreshHistory',
				],
			},
		},
		default: '',
		description: 'Maximum number of entries to return ($top parameter)',
	},
];
