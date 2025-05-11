"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBIHeaderAuth = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const resources_1 = require("./resources");
class PowerBIHeaderAuth {
    constructor() {
        this.description = {
            displayName: 'Power BI (Header Auth)',
            name: 'powerBIHeaderAuth',
            icon: 'file:powerbi.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consumo da API do Power BI usando autenticação por token no cabeçalho',
            defaults: {
                name: 'Power BI (Header Auth)',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Token de Autenticação',
                    name: 'authToken',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Token de acesso do Power BI. Ex.: "Bearer eyJ0eXAi..." ou apenas "eyJ0eXAi..."',
                    displayOptions: {
                        show: {
                            '@version': [1],
                        },
                    },
                    typeOptions: {
                        password: true,
                    },
                },
                {
                    displayName: 'Recurso',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Admin',
                            value: 'admin',
                        },
                        {
                            name: 'Dashboard',
                            value: 'dashboard',
                        },
                        {
                            name: 'Dataset',
                            value: 'dataset',
                        },
                        {
                            name: 'Grupo (Workspace)',
                            value: 'group',
                        },
                        {
                            name: 'Relatório',
                            value: 'report',
                        },
                    ],
                    default: 'report',
                    required: true,
                },
                {
                    displayName: 'Operação',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get Info',
                            value: 'getInfo',
                            description: 'Obter informações sobre a API do Power BI',
                            action: 'Get info from power bi',
                        },
                        {
                            name: 'Get Scan Result',
                            value: 'getScanResult',
                            description: 'Obter detalhes do escaneamento de DLP de um artefato',
                            action: 'Get scan result from power bi',
                        },
                        {
                            name: 'Generate Auth URL',
                            value: 'generateAuthUrl',
                            description: 'Gerar URL para obter o código de autorização',
                            action: 'Generate auth URL',
                        },
                        {
                            name: 'Get Token',
                            value: 'getToken',
                            description: 'Obter token de acesso usando um código de autorização',
                            action: 'Get token',
                        },
                        {
                            name: 'Refresh Token',
                            value: 'refreshToken',
                            description: 'Renovar token de acesso usando um refresh token',
                            action: 'Refresh token',
                        },
                    ],
                    default: 'getInfo',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    description: 'Client ID do aplicativo registrado no Azure AD',
                },
                {
                    displayName: 'Redirect URI',
                    name: 'redirectUri',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'https://example.com/callback',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    description: 'URI de redirecionamento configurado no registro do aplicativo',
                },
                {
                    displayName: 'Tenant',
                    name: 'tenant',
                    type: 'string',
                    default: 'common',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    description: 'ID do inquilino do Azure AD ou "common" para contas pessoais',
                },
                {
                    displayName: 'Extras',
                    name: 'extras',
                    type: 'collection',
                    placeholder: 'Adicionar opção',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'State',
                            name: 'state',
                            type: 'string',
                            default: '',
                            description: 'Valor de estado para verificação anti-CSRF',
                        },
                        {
                            displayName: 'Prompt',
                            name: 'prompt',
                            type: 'options',
                            options: [
                                {
                                    name: 'None',
                                    value: 'none',
                                    description: 'Não mostra a interface de autenticação',
                                },
                                {
                                    name: 'Login',
                                    value: 'login',
                                    description: 'Mostra a tela de login',
                                },
                                {
                                    name: 'Consent',
                                    value: 'consent',
                                    description: 'Mostra a tela de consentimento',
                                },
                                {
                                    name: 'Select Account',
                                    value: 'select_account',
                                    description: 'Mostra a seleção de conta',
                                },
                            ],
                            default: 'consent',
                            description: 'Tipo de interação do usuário',
                        },
                    ],
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    description: 'Client ID do aplicativo registrado no Azure AD',
                },
                {
                    displayName: 'Client Secret',
                    name: 'clientSecret',
                    type: 'string',
                    default: '',
                    required: true,
                    typeOptions: {
                        password: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    description: 'Secret do aplicativo registrado no Azure AD',
                },
                {
                    displayName: 'Redirect URI',
                    name: 'redirectUri',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'https://example.com/callback',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    description: 'URI de redirecionamento configurado no registro do aplicativo',
                },
                {
                    displayName: 'Authorization Code',
                    name: 'code',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    description: 'Código de autorização obtido pelo fluxo OAuth2',
                },
                {
                    displayName: 'Tenant',
                    name: 'tenant',
                    type: 'string',
                    default: 'common',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    description: 'ID do inquilino do Azure AD ou "common" para contas pessoais',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    description: 'Client ID do aplicativo registrado no Azure AD',
                },
                {
                    displayName: 'Client Secret',
                    name: 'clientSecret',
                    type: 'string',
                    default: '',
                    required: true,
                    typeOptions: {
                        password: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    description: 'Secret do aplicativo registrado no Azure AD',
                },
                {
                    displayName: 'Refresh Token',
                    name: 'refreshToken',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    description: 'Token de atualização obtido anteriormente',
                },
                {
                    displayName: 'Tenant',
                    name: 'tenant',
                    type: 'string',
                    default: 'common',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    description: 'ID do inquilino do Azure AD ou "common" para contas pessoais',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'string',
                    default: 'https://analysis.windows.net/powerbi/api',
                    description: 'Resource identifier',
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Scan ID',
                    name: 'scanId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getScanResult',
                            ],
                        },
                    },
                    description: 'ID do escaneamento DLP',
                },
                {
                    displayName: 'Operação',
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
                            name: 'Get',
                            value: 'get',
                            description: 'Obter um dashboard específico',
                            action: 'Get a dashboard',
                        },
                        {
                            name: 'Get Tiles',
                            value: 'getTiles',
                            description: 'Obter tiles de um dashboard',
                            action: 'Get tiles from a dashboard',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Listar todos os dashboards',
                            action: 'List all dashboards',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Operação',
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
                            description: 'Adicionar linhas a uma tabela',
                            action: 'Add rows to a table',
                        },
                        {
                            name: 'Execute Queries',
                            value: 'executeQueries',
                            description: 'Executar consultas DAX',
                            action: 'Execute DAX queries',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Obter um dataset específico',
                            action: 'Get a dataset',
                        },
                        {
                            name: 'Get Refresh History',
                            value: 'getRefreshHistory',
                            description: 'Obter histórico de atualizações',
                            action: 'Get the refresh history',
                        },
                        {
                            name: 'Get Tables',
                            value: 'getTables',
                            description: 'Obter tabelas de um dataset',
                            action: 'Get tables from a dataset',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Listar todos os datasets',
                            action: 'List all datasets',
                        },
                        {
                            name: 'Refresh',
                            value: 'refresh',
                            description: 'Atualizar um dataset',
                            action: 'Refresh a dataset',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Operação',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'group',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Obter um grupo específico',
                            action: 'Get a group',
                        },
                        {
                            name: 'Get Dashboards',
                            value: 'getDashboards',
                            description: 'Obter dashboards de um grupo',
                            action: 'Get dashboards from a group',
                        },
                        {
                            name: 'Get Datasets',
                            value: 'getDatasets',
                            description: 'Obter datasets de um grupo',
                            action: 'Get datasets from a group',
                        },
                        {
                            name: 'Get Reports',
                            value: 'getReports',
                            description: 'Obter relatórios de um grupo',
                            action: 'Get reports from a group',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Listar todos os grupos',
                            action: 'List all groups',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Operação',
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
                            name: 'Export To File',
                            value: 'exportToFile',
                            description: 'Exportar relatório para arquivo',
                            action: 'Export a report to file',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Obter um relatório específico',
                            action: 'Get a report',
                        },
                        {
                            name: 'Get Pages',
                            value: 'getPages',
                            description: 'Obter páginas de um relatório',
                            action: 'Get pages from a report',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Listar todos os relatórios',
                            action: 'List all reports',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getGroups',
                    },
                    default: '',
                    description: 'ID do grupo do Power BI',
                    displayOptions: {
                        show: {
                            resource: [
                                'report',
                            ],
                            operation: [
                                'get',
                                'getPages',
                                'list',
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
                    default: '',
                    required: true,
                    description: 'ID do relatório',
                    displayOptions: {
                        show: {
                            resource: [
                                'report',
                            ],
                            operation: [
                                'get',
                                'getPages',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Group (Workspace)',
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
                    description: 'ID do grupo do Power BI',
                },
                {
                    displayName: 'Report ID',
                    name: 'reportId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getReports',
                        loadOptionsDependsOn: ['groupId'],
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
                    description: 'ID do relatório a ser exportado',
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
                    description: 'Tipo de relatório a ser exportado',
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
                    description: 'Formato para exportação',
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
                    description: 'Formato para exportação',
                },
                {
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
                    },
                    description: 'Se deve esperar a exportação ser concluída',
                },
                {
                    displayName: 'Download File',
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
                    description: 'Se ativado, o arquivo será disponibilizado como arquivo binário para download e também como base64 no campo fileBase64 para uso em integrações como WhatsApp',
                },
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
                            description: 'Tempo máximo de espera em segundos',
                        },
                        {
                            displayName: 'Polling Interval',
                            name: 'pollingInterval',
                            type: 'number',
                            default: 5,
                            description: 'Intervalo entre verificações em segundos',
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
                            description: 'Se deve incluir páginas ocultas',
                        },
                        {
                            displayName: 'Locale',
                            name: 'locale',
                            type: 'string',
                            default: '',
                            placeholder: 'e.g. pt-BR',
                            description: 'Localização para uso na exportação',
                        },
                        {
                            displayName: 'Export Specific Pages',
                            name: 'exportSpecificPages',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve exportar apenas páginas específicas',
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
                            description: 'Array JSON de configurações de página. Exemplo: [{"pageName": "ReportSection1", "visualName": "VisualName1"}, {"pageName": "ReportSection2"}]',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                        },
                        {
                            displayName: 'Use Report Level Filters',
                            name: 'useReportLevelFilters',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve aplicar filtros no nível do relatório',
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
                            description: 'Array JSON de configurações de filtro. Exemplo: [{"filter": "Table1/Column1 eq \'value\'"}]',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                        },
                        {
                            displayName: 'Use Default Bookmark',
                            name: 'useDefaultBookmark',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve aplicar um bookmark padrão em todas as páginas',
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
                            description: 'Nome do bookmark a ser aplicado',
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
                            description: 'Estado do bookmark a ser aplicado',
                        },
                        {
                            displayName: 'Use Alternative Dataset',
                            name: 'useAlternativeDataset',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve vincular o relatório a um dataset diferente',
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
                            description: 'ID do dataset para vincular',
                        },
                        {
                            displayName: 'Use Identities (RLS)',
                            name: 'useIdentities',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve aplicar identidades de Row-Level Security',
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
                            description: 'Array JSON de configurações de identidade para RLS. Exemplo: [{"username": "user1@contoso.com", "roles": ["Role1", "Role2"]}]',
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
                            placeholder: 'e.g. pt-BR',
                            description: 'Localização para uso na exportação',
                        },
                        {
                            displayName: 'Use Parameters',
                            name: 'useParameters',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve fornecer parâmetros para o relatório',
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
                            description: 'Array JSON de configurações de parâmetros. Exemplo: [{"name": "Parameter1", "value": "Value1"}, {"name": "Parameter2", "value": "Value2"}]',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                        },
                        {
                            displayName: 'Use Format Settings',
                            name: 'useFormatSettings',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve fornecer configurações específicas de formato',
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
                            description: 'Objeto JSON com configurações específicas de formato. Exemplo: {"PageWidth": "8.5in", "PageHeight": "11in"}',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                        },
                        {
                            displayName: 'Use Identities (RLS)',
                            name: 'useIdentities',
                            type: 'boolean',
                            default: false,
                            description: 'Se deve aplicar identidades de Row-Level Security',
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
                            description: 'Array JSON de configurações de identidade para RLS. Exemplo: [{"username": "user1@contoso.com", "roles": ["Role1", "Role2"]}]',
                            typeOptions: {
                                alwaysOpenEditWindow: true,
                            },
                        },
                    ],
                },
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getGroups',
                    },
                    default: '',
                    description: 'ID do grupo do Power BI',
                    displayOptions: {
                        show: {
                            resource: [
                                'dashboard',
                            ],
                            operation: [
                                'get',
                                'getTiles',
                                'list',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Dashboard ID',
                    name: 'dashboardId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getDashboards',
                        loadOptionsDependsOn: ['groupId'],
                    },
                    default: '',
                    required: true,
                    description: 'ID do dashboard',
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
                },
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getGroups',
                    },
                    default: '',
                    description: 'ID do grupo do Power BI',
                    displayOptions: {
                        show: {
                            resource: [
                                'dataset',
                            ],
                            operation: [
                                'get',
                                'getTables',
                                'getRefreshHistory',
                                'list',
                                'refresh',
                                'addRows',
                                'executeQueries',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Dataset ID',
                    name: 'datasetId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getDatasets',
                        loadOptionsDependsOn: ['groupId'],
                    },
                    default: '',
                    required: true,
                    description: 'ID do dataset',
                    displayOptions: {
                        show: {
                            resource: [
                                'dataset',
                            ],
                            operation: [
                                'get',
                                'getTables',
                                'getRefreshHistory',
                                'refresh',
                                'addRows',
                                'executeQueries',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Table Name',
                    name: 'tableName',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getTables',
                        loadOptionsDependsOn: [
                            'groupId',
                            'datasetId',
                        ],
                    },
                    default: '',
                    required: true,
                    description: 'Nome da tabela para adicionar linhas',
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
                },
                {
                    displayName: 'Rows',
                    name: 'rows',
                    type: 'json',
                    default: '[]',
                    required: true,
                    description: 'Dados a serem adicionados na tabela',
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
                },
                {
                    displayName: 'DAX Query',
                    name: 'query',
                    type: 'json',
                    default: '{ "queries": [{ "query": "EVALUATE ROW(\\"Result\\", 1)" }], "impersonatedUserName": null, "serializeResults": true }',
                    required: true,
                    description: 'Consulta DAX a ser executada',
                    hint: 'Formato: { "queries": [{ "query": "EVALUATE..." }], "serializeResults": true }',
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
                },
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getGroups',
                    },
                    default: '',
                    required: true,
                    description: 'ID do grupo do Power BI',
                    displayOptions: {
                        show: {
                            resource: [
                                'group',
                            ],
                            operation: [
                                'get',
                                'getDashboards',
                                'getDatasets',
                                'getReports',
                            ],
                        },
                    },
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getGroups() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getGroups.call(this, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
                    }
                },
                async getGroupsMultiSelect() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getGroupsMultiSelect.call(this, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
                    }
                },
                async getDashboards() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDashboards.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar dashboards. Verifique o token.', value: '' }];
                    }
                },
                async getDatasets() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDatasets.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar datasets. Verifique o token.', value: '' }];
                    }
                },
                async getTables() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        const datasetId = this.getNodeParameter('datasetId', '');
                        if (!datasetId) {
                            return [{ name: '-- Selecione um dataset primeiro --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getTables.call(this, groupId, datasetId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar tabelas. Verifique o token.', value: '' }];
                    }
                },
                async getReports() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getReports.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar relatórios. Verifique o token.', value: '' }];
                    }
                },
            },
        };
        this.description.usableAsTool = true;
        this.description.displayName = 'Power BI Header Auth';
        this.description.codex = {
            categories: ['Power BI'],
            subcategories: {
                'Power BI': ['Authentication', 'API'],
            },
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const isGenerateAuthUrlOperation = (resource === 'admin' && operation === 'generateAuthUrl');
        const isGetTokenOperation = (resource === 'admin' && operation === 'getToken');
        const isRefreshTokenOperation = (resource === 'admin' && operation === 'refreshToken');
        const isAuthExemptOperation = isGenerateAuthUrlOperation || isGetTokenOperation || isRefreshTokenOperation;
        let authToken = '';
        if (!isAuthExemptOperation) {
            try {
                if ((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.access_token) {
                    authToken = items[0].json.access_token;
                }
                else {
                    authToken = this.getNodeParameter('authToken', 0);
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Falha ao obter token de autenticação');
            }
            if (!authToken) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Token de autenticação é obrigatório. Forneça um token na entrada ou no parâmetro do nó.');
            }
        }
        const headers = {};
        if (!isAuthExemptOperation) {
            if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                authToken = authToken.trim().substring(7);
            }
            headers.Authorization = `Bearer ${authToken}`;
        }
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'dashboard') {
                    if (operation in resources_1.resources.dashboard) {
                        const results = await resources_1.resources.dashboard[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'dataset') {
                    if (operation in resources_1.resources.dataset) {
                        const results = await resources_1.resources.dataset[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'group') {
                    if (operation in resources_1.resources.group) {
                        const results = await resources_1.resources.group[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'report') {
                    if (operation in resources_1.resources.report) {
                        const results = await resources_1.resources.report[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'admin') {
                    if (operation in resources_1.resources.admin) {
                        const results = await resources_1.resources.admin[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                if (responseData === null) {
                    continue;
                }
                if (responseData === undefined) {
                    responseData = {};
                }
                try {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                catch (processingError) {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: 'Erro ao processar resultados', details: String(processingError) }), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.PowerBIHeaderAuth = PowerBIHeaderAuth;
//# sourceMappingURL=PowerBIHeaderAuth.node.js.map