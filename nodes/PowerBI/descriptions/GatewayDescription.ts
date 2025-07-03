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
				description: 'Retorna a fonte de dados especificada do gateway especificado',
				action: 'Get datasource',
			},
			{
				name: 'Get Datasource Status',
				value: 'getDatasourceStatus',
				description: 'Verifica o status de conectividade da fonte de dados especificada',
				action: 'Get datasource status',
			},
			{
				name: 'Get Datasources',
				value: 'getDatasources',
				description: 'Retorna uma lista de fontes de dados do gateway especificado',
				action: 'Get datasources',
			},
			{
				name: 'Get Datasource Users',
				value: 'getDatasourceUsers',
				description: 'Retorna uma lista de usuários que têm acesso à fonte de dados especificada',
				action: 'Get datasource users',
			},
			{
				name: 'Get Gateway',
				value: 'get',
				description: 'Retorna o gateway especificado',
				action: 'Get gateway',
			},
			{
				name: 'Listar Gateways',
				value: 'list',
				description: 'Retorna uma lista de gateways para os quais o usuário é administrador',
				action: 'List gateways',
			},
		],
		default: 'list',
	},
];

export const gatewayFields: INodeProperties[] = [
	// Gateway ID field for getDatasource operation
	{
		displayName: 'Gateway',
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
		description: 'O gateway que contém a fonte de dados',
	},
	// Datasource ID field for getDatasource operation
	{
		displayName: 'Datasource',
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
		description: 'A fonte de dados a ser obtida',
	},
	// Gateway ID field for getDatasourceStatus operation
	{
		displayName: 'Gateway',
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
		description: 'O gateway que contém a fonte de dados',
	},
	// Datasource ID field for getDatasourceStatus operation
	{
		displayName: 'Datasource',
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
		description: 'A fonte de dados para verificar o status',
	},
	// Gateway ID field for getDatasources operation
	{
		displayName: 'Gateway',
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
		description: 'O gateway para obter as fontes de dados',
	},
	// Gateway ID field for getDatasourceUsers operation
	{
		displayName: 'Gateway',
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
		description: 'O gateway que contém a fonte de dados',
	},
	// Datasource ID field for getDatasourceUsers operation
	{
		displayName: 'Datasource',
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
		description: 'A fonte de dados para obter os usuários',
	},
	// Gateway ID field for get operation
	{
		displayName: 'Gateway',
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
		description: 'O gateway a ser obtido',
	},
];
