"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardFields = exports.dashboardOperations = void 0;
exports.dashboardOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'dashboard',
                ],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'List all dashboards',
                action: 'List a dashboard',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a specific dashboard',
                action: 'Get a dashboard',
            },
            {
                name: 'Get Tiles',
                value: 'getTiles',
                description: 'Get tiles from a dashboard',
                action: 'Get tiles from a dashboard',
            },
        ],
        default: 'list',
    },
];
exports.dashboardFields = [
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
                    'dashboard',
                ],
                operation: [
                    'list',
                    'get',
                    'getTiles',
                ],
            },
        },
    },
    {
        displayName: 'Dashboard Name or ID',
        name: 'dashboardId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getDashboards',
            loadOptionsDependsOn: ['groupId'],
        },
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'dashboard',
                ],
                operation: [
                    'get',
                    'getTiles',
                ],
            },
        },
        default: '',
        description: 'ID of the dashboard to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
];
//# sourceMappingURL=DashboardDescription.js.map