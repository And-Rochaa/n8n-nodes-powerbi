"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasetFields = exports.datasetOperations = void 0;
exports.datasetOperations = [
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
                name: 'Add Rows',
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
                name: 'Get',
                value: 'get',
                description: 'Get a specific dataset',
                action: 'Get a dataset',
            },
            {
                name: 'Get Refresh History',
                value: 'getRefreshHistory',
                description: 'Get the refresh history of a dataset',
                action: 'Get refresh history of a dataset',
            },
            {
                name: 'Get Tables',
                value: 'getTables',
                description: 'Get tables from a dataset',
                action: 'Get tables from a dataset',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List all datasets',
                action: 'List a dataset',
            },
            {
                name: 'Refresh',
                value: 'refresh',
                description: 'Refresh a dataset',
                action: 'Refresh a dataset',
            },
        ],
        default: 'list',
    },
];
exports.datasetFields = [
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
    },
    {
        displayName: 'Dataset Name or ID',
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
        description: 'ID of the dataset to be retrieved. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Table Name or ID',
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
        description: 'Name of the table to add rows to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    }, {
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
        }, default: '',
        description: 'The data to be added to the table (JSON format)',
    }, {
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
    },
    {
        displayName: 'Include Nulls',
        name: 'includeNulls',
        type: 'boolean',
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
        default: false,
        description: 'Whether null (blank) values should be included in the result set',
    },
    {
        displayName: 'Impersonated User Name',
        name: 'impersonatedUserName',
        type: 'string',
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
        placeholder: 'someuser@mycompany.com',
        description: 'The UPN of a user to be impersonated. If the model is not RLS enabled, this will be ignored.',
    },
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
//# sourceMappingURL=DatasetDescription.js.map