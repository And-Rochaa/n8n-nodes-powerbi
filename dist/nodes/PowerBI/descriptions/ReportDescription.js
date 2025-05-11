"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportFields = exports.reportOperations = void 0;
exports.reportOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'List all reports',
                action: 'List a report',
            }, {
                name: 'Get',
                value: 'get',
                description: 'Get a specific report',
                action: 'Get a report',
            },
            {
                name: 'Get Pages',
                value: 'getPages',
                description: 'Get pages from a report',
                action: 'Get pages from a report',
            },
            {
                name: 'Export To File',
                value: 'exportToFile',
                description: 'Export report to various file formats',
                action: 'Export report to file',
            },
        ],
        default: 'list',
    },
];
exports.reportFields = [
    {
        displayName: 'Group (Workspace)',
        name: 'groupId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getGroups',
        }, default: '',
        description: 'Power BI group (workspace) ID. Leave blank to use "My Workspace".',
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'list',
                    'get',
                    'getPages',
                ],
            },
        },
    },
    {
        displayName: 'Report ID',
        name: 'reportId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getReports',
            loadOptionsDependsOn: ['groupId'],
        },
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ], operation: [
                    'get',
                    'getPages',
                ],
            },
        },
        default: '',
        description: 'ID of the report to retrieve',
    },
    {
        displayName: 'Workspace Name or ID',
        name: 'groupId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getGroups',
        },
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
            },
        },
        description: 'The ID of the workspace. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
    },
    {
        displayName: 'Report Name or ID',
        name: 'reportId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getReports',
            loadOptionsDependsOn: [
                'groupId',
            ],
        },
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
            },
        },
        description: 'The ID of the report. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
    },
    {
        displayName: 'Report Type',
        name: 'reportType',
        type: 'options',
        options: [
            {
                name: 'Power BI Report',
                value: 'powerBI',
            },
            {
                name: 'Paginated Report',
                value: 'paginated',
            },
        ],
        default: 'powerBI',
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
            },
        },
        description: 'Type of report to export',
    },
    {
        displayName: 'Export Format',
        name: 'exportFormat',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
                reportType: [
                    'powerBI',
                ],
            },
        },
        options: [
            {
                name: 'PDF',
                value: 'PDF',
            },
            {
                name: 'PNG',
                value: 'PNG',
            },
            {
                name: 'PowerPoint (PPTX)',
                value: 'PPTX',
            },
        ],
        default: 'PDF',
        description: 'The format to export to',
    },
    {
        displayName: 'Export Format',
        name: 'exportFormat',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
                reportType: [
                    'paginated',
                ],
            },
        },
        options: [
            {
                name: 'PDF',
                value: 'PDF',
            },
            {
                name: 'Accessible PDF',
                value: 'ACCESSIBLEPDF',
            },
            {
                name: 'CSV',
                value: 'CSV',
            },
            {
                name: 'Image (BMP, EMF, GIF, JPEG, PNG, TIFF)',
                value: 'IMAGE',
            },
            {
                name: 'Microsoft Excel (XLSX)',
                value: 'XLSX',
            },
            {
                name: 'Microsoft Word (DOCX)',
                value: 'DOCX',
            },
            {
                name: 'MHTML (Web Archive)',
                value: 'MHTML',
            },
            {
                name: 'XML',
                value: 'XML',
            },
        ],
        default: 'PDF',
        description: 'The format to export to',
    }, {
        displayName: 'Wait For Completion',
        name: 'waitForCompletion',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
            },
        }, description: 'Whether to wait for the export to complete before returning the result',
    }, { displayName: 'Baixar Arquivo',
        name: 'downloadFile',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
                waitForCompletion: [
                    true,
                ],
            },
        },
        description: 'Se ativado, o arquivo será disponibilizado como arquivo binário para download e também como base64 no campo fileBase64 para uso em integrações como WhatsApp', },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
            },
        },
        options: [
            {
                displayName: 'Maximum Wait Time',
                name: 'maxWaitTime',
                type: 'number',
                default: 300,
                description: 'Maximum time to wait for export completion in seconds',
            },
            {
                displayName: 'Polling Interval',
                name: 'pollingInterval',
                type: 'number',
                default: 5,
                description: 'Interval in seconds between status checks',
            },
        ],
    },
    {
        displayName: 'Power BI Report Configuration',
        name: 'powerBIReportConfig',
        type: 'collection',
        placeholder: 'Add Configuration',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
                reportType: [
                    'powerBI',
                ],
            },
        },
        options: [
            {
                displayName: 'Include Hidden Pages',
                name: 'includeHiddenPages',
                type: 'boolean',
                default: false,
                description: 'Whether to include hidden pages in the export',
            },
            {
                displayName: 'Locale',
                name: 'locale',
                type: 'string',
                default: '',
                placeholder: 'e.g. en-US',
                description: 'Locale to use for the export',
            },
            {
                displayName: 'Export Specific Pages',
                name: 'exportSpecificPages',
                type: 'boolean',
                default: false,
                description: 'Whether to export specific pages only',
            },
            {
                displayName: 'Pages',
                name: 'pages',
                type: 'string',
                default: '[]',
                displayOptions: {
                    show: {
                        exportSpecificPages: [
                            true,
                        ],
                    },
                },
                description: 'JSON array of page configurations. Example: [{"pageName": "ReportSection1", "visualName": "VisualName1"}, {"pageName": "ReportSection2"}]',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
            {
                displayName: 'Use Report Level Filters',
                name: 'useReportLevelFilters',
                type: 'boolean',
                default: false,
                description: 'Whether to apply filters at the report level',
            },
            {
                displayName: 'Report Level Filters',
                name: 'reportLevelFilters',
                type: 'string',
                default: '[]',
                displayOptions: {
                    show: {
                        useReportLevelFilters: [
                            true,
                        ],
                    },
                },
                description: 'JSON array of filter configurations. Example: [{"filter": "Table1/Column1 eq \'value\'"}]',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
            {
                displayName: 'Use Default Bookmark',
                name: 'useDefaultBookmark',
                type: 'boolean',
                default: false,
                description: 'Whether to apply a default bookmark to all pages',
            },
            {
                displayName: 'Default Bookmark Name',
                name: 'defaultBookmarkName',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        useDefaultBookmark: [
                            true,
                        ],
                    },
                },
                description: 'The name of the bookmark to apply',
            },
            {
                displayName: 'Default Bookmark State',
                name: 'defaultBookmarkState',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        useDefaultBookmark: [
                            true,
                        ],
                    },
                },
                description: 'The state of the bookmark to apply',
            },
            {
                displayName: 'Use Alternative Dataset',
                name: 'useAlternativeDataset',
                type: 'boolean',
                default: false,
                description: 'Whether to bind the report to a different dataset',
            },
            {
                displayName: 'Dataset ID',
                name: 'datasetToBind',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        useAlternativeDataset: [
                            true,
                        ],
                    },
                },
                description: 'The ID of the dataset to bind to',
            },
            {
                displayName: 'Use Identities (RLS)',
                name: 'useIdentities',
                type: 'boolean',
                default: false,
                description: 'Whether to apply Row-Level Security identities',
            },
            {
                displayName: 'Identities',
                name: 'identities',
                type: 'string',
                default: '[]',
                displayOptions: {
                    show: {
                        useIdentities: [
                            true,
                        ],
                    },
                },
                description: 'JSON array of identity configurations for RLS. Example: [{"username": "user1@contoso.com", "roles": ["Role1", "Role2"]}]',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
        ],
    },
    {
        displayName: 'Paginated Report Configuration',
        name: 'paginatedReportConfig',
        type: 'collection',
        placeholder: 'Add Configuration',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'report',
                ],
                operation: [
                    'exportToFile',
                ],
                reportType: [
                    'paginated',
                ],
            },
        },
        options: [
            {
                displayName: 'Locale',
                name: 'locale',
                type: 'string',
                default: '',
                placeholder: 'e.g. en-US',
                description: 'Locale to use for the export',
            },
            {
                displayName: 'Use Parameters',
                name: 'useParameters',
                type: 'boolean',
                default: false,
                description: 'Whether to provide report parameters',
            },
            {
                displayName: 'Parameter Values',
                name: 'parameterValues',
                type: 'string',
                default: '[]',
                displayOptions: {
                    show: {
                        useParameters: [
                            true,
                        ],
                    },
                },
                description: 'JSON array of parameter configurations. Example: [{"name": "Parameter1", "value": "Value1"}, {"name": "Parameter2", "value": "Value2"}]',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
            {
                displayName: 'Use Format Settings',
                name: 'useFormatSettings',
                type: 'boolean',
                default: false,
                description: 'Whether to provide format-specific settings',
            },
            {
                displayName: 'Format Settings',
                name: 'formatSettings',
                type: 'string',
                default: '{}',
                displayOptions: {
                    show: {
                        useFormatSettings: [
                            true,
                        ],
                    },
                },
                description: 'JSON object with format-specific settings. Example: {"PageWidth": "8.5in", "PageHeight": "11in"}',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
            {
                displayName: 'Use Identities (RLS)',
                name: 'useIdentities',
                type: 'boolean',
                default: false,
                description: 'Whether to apply Row-Level Security identities',
            },
            {
                displayName: 'Identities',
                name: 'identities',
                type: 'string',
                default: '[]',
                displayOptions: {
                    show: {
                        useIdentities: [
                            true,
                        ],
                    },
                },
                description: 'JSON array of identity configurations for RLS. Example: [{"username": "user1@contoso.com", "roles": ["Role1", "Role2"]}]',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
            },
        ],
    },
];
//# sourceMappingURL=ReportDescription.js.map