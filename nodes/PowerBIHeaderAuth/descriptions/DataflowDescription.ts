import { INodeProperties } from 'n8n-workflow';

export const dataflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'dataflow',
				],
			},
		},
		options: [
			{
				name: 'Get Dataflows',
				value: 'list',
				description: 'Returns a list of dataflows from the specified workspace',
				action: 'Get dataflows',
			},
			{
				name: 'Get Dataflow',
				value: 'get',
				description: 'Exports the specified dataflow definition to a JSON file',
				action: 'Get dataflow',
			},
			{
				name: 'Get Dataflow Data Sources',
				value: 'getDatasources',
				description: 'Returns a list of data sources for the specified dataflow',
				action: 'Get dataflow data sources',
			},
			{
				name: 'Get Dataflow Transactions',
				value: 'getTransactions',
				description: 'Returns a list of transactions for the specified dataflow',
				action: 'Get dataflow transactions',
			},
			{
				name: 'Refresh Dataflow',
				value: 'refresh',
				description: 'Triggers a refresh for the specified dataflow',
				action: 'Refresh dataflow',
			},
		],
		default: 'list',
	},
];

export const dataflowFields: INodeProperties[] = [
	// Group ID field for list operation
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['list'],
			},
		},
		default: '',
		required: true,
		description: 'The workspace (group) to get dataflows from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Group ID field for get operation
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The workspace that contains the dataflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Dataflow ID field for get operation
	{
		displayName: 'Dataflow Name or ID',
		name: 'dataflowId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDataflows',
			loadOptionsDependsOn: ['groupId'],
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The dataflow to get the definition for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Group ID field for getDatasources operation
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['getDatasources'],
			},
		},
		default: '',
		required: true,
		description: 'The workspace that contains the dataflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Dataflow ID field for getDatasources operation
	{
		displayName: 'Dataflow Name or ID',
		name: 'dataflowId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDataflows',
			loadOptionsDependsOn: ['groupId'],
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['getDatasources'],
			},
		},
		default: '',
		required: true,
		description: 'The dataflow to get data sources for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Group ID field for getTransactions operation
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['getTransactions'],
			},
		},
		default: '',
		required: true,
		description: 'The workspace that contains the dataflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Dataflow ID field for getTransactions operation
	{
		displayName: 'Dataflow Name or ID',
		name: 'dataflowId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDataflows',
			loadOptionsDependsOn: ['groupId'],
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['getTransactions'],
			},
		},
		default: '',
		required: true,
		description: 'The dataflow to get transactions for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Group ID field for refresh operation
	{
		displayName: 'Group Name or ID',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['refresh'],
			},
		},
		default: '',
		required: true,
		description: 'The workspace that contains the dataflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Dataflow ID field for refresh operation
	{
		displayName: 'Dataflow Name or ID',
		name: 'dataflowId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDataflows',
			loadOptionsDependsOn: ['groupId'],
		},
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['refresh'],
			},
		},
		default: '',
		required: true,
		description: 'The dataflow to refresh. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// Notify Option field for refresh operation
	{
		displayName: 'Notification Option',
		name: 'notifyOption',
		type: 'options',
		options: [
			{
				name: 'No Notification',
				value: 'NoNotification',
				description: 'No notification will be sent',
			},
			{
				name: 'Mail on Failure',
				value: 'MailOnFailure',
				description: 'An email notification will be sent on refresh failure',
			},
		],
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['refresh'],
			},
		},
		default: 'NoNotification',
		required: true,
		description: 'Email notification options',
	},
	// Process Type field for refresh operation
	{
		displayName: 'Process Type',
		name: 'processType',
		type: 'options',
		options: [
			{
				name: 'Default',
				value: 'default',
				description: 'Default refresh process type',
			},
		],
		displayOptions: {
			show: {
				resource: ['dataflow'],
				operation: ['refresh'],
			},
		},
		default: 'default',
		description: 'The type of refresh process to use (optional)',
	},
];
