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
				description: 'Returns a list of all dataflows from the specified workspace',
				action: 'Get dataflows',
			},
			{
				name: 'Get Dataflow',
				value: 'get',
				description: 'Exports the specified dataflow definition to a JSON file',
				action: 'Get dataflow',
			},
		],
		default: 'list',
	},
];

export const dataflowFields: INodeProperties[] = [
	// Group ID field for list operation
	{
		displayName: 'Workspace',
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
		description: 'The workspace to get dataflows from',
	},
	// Group ID field for get operation
	{
		displayName: 'Workspace',
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
		description: 'The workspace that contains the dataflow',
	},
	// Dataflow ID field for get operation
	{
		displayName: 'Dataflow',
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
		description: 'The dataflow to get the definition for',
	},
];
