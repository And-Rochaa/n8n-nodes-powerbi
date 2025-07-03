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
				description: 'Retorna uma lista de dataflows do workspace especificado',
				action: 'Get dataflows',
			},
			{
				name: 'Get Dataflow',
				value: 'get',
				description: 'Exporta a definição do fluxo de dados especificado para um arquivo JSON',
				action: 'Get dataflow',
			},
		],
		default: 'list',
	},
];

export const dataflowFields: INodeProperties[] = [
	// Group ID field for list operation
	{
		displayName: 'Group',
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
		description: 'O workspace (grupo) para obter os dataflows',
	},
	// Group ID field for get operation
	{
		displayName: 'Group',
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
		description: 'O workspace que contém o fluxo de dados',
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
		description: 'O fluxo de dados para obter a definição',
	},
];
