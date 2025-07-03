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
                description: 'Returns a list of dataflows from the specified workspace',
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
exports.dataflowFields = [
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
        description: 'The workspace (group) to get dataflows from',
    },
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
        description: 'The workspace that contains the dataflow',
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
        description: 'The dataflow to get the definition for',
    },
];
//# sourceMappingURL=DataflowDescription.js.map