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
                operation: ['getDatasources'],
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
                operation: ['getDatasources'],
            },
        },
        default: '',
        required: true,
        description: 'The dataflow to get data sources for',
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
                operation: ['getTransactions'],
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
                operation: ['getTransactions'],
            },
        },
        default: '',
        required: true,
        description: 'The dataflow to get transactions for',
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
                operation: ['refresh'],
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
                operation: ['refresh'],
            },
        },
        default: '',
        required: true,
        description: 'The dataflow to refresh',
    },
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
        default: '',
        description: 'The type of refresh process to use (optional)',
    },
];
//# sourceMappingURL=DataflowDescription.js.map