"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataflowFields = exports.dataflowOperations = void 0;
exports.dataflowOperations = [
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
                description: 'Retorna uma lista de todos os fluxos de dados do workspace especificado',
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
exports.dataflowFields = [
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
        description: 'O workspace para obter os fluxos de dados',
    },
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
        description: 'O workspace que contém o fluxo de dados',
    },
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
//# sourceMappingURL=DataflowDescription.js.map