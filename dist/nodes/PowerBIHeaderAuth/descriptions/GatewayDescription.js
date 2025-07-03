"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayFields = exports.gatewayOperations = void 0;
exports.gatewayOperations = [
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
exports.gatewayFields = [
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
        description: 'The gateway that contains the datasource',
    },
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
        description: 'The datasource to be retrieved',
    },
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
        description: 'The gateway that contains the datasource',
    },
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
        description: 'The datasource to check status for',
    },
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
        description: 'The gateway to get datasources from',
    },
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
        description: 'The gateway that contains the datasource',
    },
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
        description: 'The datasource to get users for',
    },
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
        description: 'The gateway to be retrieved',
    },
];
//# sourceMappingURL=GatewayDescription.js.map