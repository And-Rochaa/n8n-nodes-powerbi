"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function exportToFile(i) {
    var _a;
    const returnData = [];
    const reportId = this.getNodeParameter('reportId', i);
    const groupId = this.getNodeParameter('groupId', i, '');
    const exportFormat = this.getNodeParameter('exportFormat', i);
    const waitForCompletion = this.getNodeParameter('waitForCompletion', i, true);
    const additionalFields = this.getNodeParameter('additionalFields', i, {});
    const maxWaitTime = additionalFields.maxWaitTime || 300;
    const pollingInterval = additionalFields.pollingInterval || 5;
    const exportEndpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
    const body = {
        format: exportFormat,
    };
    const reportType = this.getNodeParameter('reportType', i, 'powerBI');
    if (reportType === 'powerBI') {
        const powerBIConfig = {};
        const includeHiddenPages = this.getNodeParameter('includeHiddenPages', i, false);
        const locale = this.getNodeParameter('locale', i, '');
        if (includeHiddenPages || locale) {
            powerBIConfig.settings = {};
            if (includeHiddenPages) {
                powerBIConfig.settings.includeHiddenPages = includeHiddenPages;
            }
            if (locale) {
                powerBIConfig.settings.locale = locale;
            }
        }
        const exportSpecificPages = this.getNodeParameter('exportSpecificPages', i, false);
        if (exportSpecificPages) {
            const pagesJson = this.getNodeParameter('pages', i, '[]');
            try {
                const pages = JSON.parse(pagesJson);
                if (pages.length > 0) {
                    powerBIConfig.pages = pages;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para páginas', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        const useReportLevelFilters = this.getNodeParameter('useReportLevelFilters', i, false);
        if (useReportLevelFilters) {
            const filtersJson = this.getNodeParameter('reportLevelFilters', i, '[]');
            try {
                const filters = JSON.parse(filtersJson);
                if (filters.length > 0) {
                    powerBIConfig.reportLevelFilters = filters;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para filtros', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        const useDefaultBookmark = this.getNodeParameter('useDefaultBookmark', i, false);
        if (useDefaultBookmark) {
            const bookmarkName = this.getNodeParameter('defaultBookmarkName', i, '');
            const bookmarkState = this.getNodeParameter('defaultBookmarkState', i, '');
            if (bookmarkName || bookmarkState) {
                powerBIConfig.defaultBookmark = {};
                if (bookmarkName) {
                    powerBIConfig.defaultBookmark.name = bookmarkName;
                }
                if (bookmarkState) {
                    powerBIConfig.defaultBookmark.state = bookmarkState;
                }
            }
        }
        const useAlternativeDataset = this.getNodeParameter('useAlternativeDataset', i, false);
        if (useAlternativeDataset) {
            const datasetId = this.getNodeParameter('datasetToBind', i, '');
            if (datasetId) {
                powerBIConfig.datasetToBind = datasetId;
            }
        }
        const useIdentities = this.getNodeParameter('useIdentities', i, false);
        if (useIdentities) {
            const identitiesJson = this.getNodeParameter('identities', i, '[]');
            try {
                const identities = JSON.parse(identitiesJson);
                if (identities.length > 0) {
                    powerBIConfig.identities = identities;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para identidades', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        if (Object.keys(powerBIConfig).length > 0) {
            body.powerBIReportConfiguration = powerBIConfig;
        }
    }
    else {
        const paginatedConfig = {};
        const locale = this.getNodeParameter('locale', i, '');
        if (locale) {
            paginatedConfig.locale = locale;
        }
        const useParameters = this.getNodeParameter('useParameters', i, false);
        if (useParameters) {
            const parametersJson = this.getNodeParameter('parameterValues', i, '[]');
            try {
                const parameters = JSON.parse(parametersJson);
                if (parameters.length > 0) {
                    paginatedConfig.parameterValues = parameters;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para parâmetros', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        const useFormatSettings = this.getNodeParameter('useFormatSettings', i, false);
        if (useFormatSettings) {
            const formatSettingsJson = this.getNodeParameter('formatSettings', i, '{}');
            try {
                const formatSettings = JSON.parse(formatSettingsJson);
                if (Object.keys(formatSettings).length > 0) {
                    paginatedConfig.formatSettings = formatSettings;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para configurações de formato', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        const useIdentities = this.getNodeParameter('useIdentities', i, false);
        if (useIdentities) {
            const identitiesJson = this.getNodeParameter('identities', i, '[]');
            try {
                const identities = JSON.parse(identitiesJson);
                if (identities.length > 0) {
                    paginatedConfig.identities = identities;
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Formato JSON inválido para identidades', {
                    description: 'Certifique-se de que o formato JSON está correto.',
                });
            }
        }
        if (Object.keys(paginatedConfig).length > 0) {
            body.paginatedReportConfiguration = paginatedConfig;
        }
    }
    try {
        const exportResponse = await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', exportEndpoint, body);
        const exportId = exportResponse.id;
        if (!waitForCompletion) {
            returnData.push({
                json: exportResponse,
            });
            return returnData;
        }
        const statusEndpoint = groupId && groupId !== 'me' ?
            `/groups/${groupId}/reports/${reportId}/exports/${exportId}` : `/reports/${reportId}/exports/${exportId}`;
        let exportStatus = exportResponse.status;
        let statusResponse = exportResponse;
        let elapsedTime = 0;
        while (exportStatus !== 'Succeeded' && exportStatus !== 'Failed' && elapsedTime < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, pollingInterval * 1000));
            elapsedTime += pollingInterval;
            statusResponse = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', statusEndpoint, {});
            exportStatus = statusResponse.status;
        }
        if (exportStatus === 'Succeeded') {
            const downloadFile = this.getNodeParameter('downloadFile', i, false);
            if (downloadFile && statusResponse.resourceLocation) {
                try {
                    const fileResponse = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', statusResponse.resourceLocation.replace('https://api.powerbi.com/v1.0/myorg', ''), {}, {}, { json: false, returnFullResponse: true });
                    let fileBuffer;
                    if (fileResponse && typeof fileResponse === 'object') {
                        if (Buffer.isBuffer(fileResponse)) {
                            fileBuffer = fileResponse;
                        }
                        else if ('body' in fileResponse && fileResponse.body) {
                            fileBuffer = fileResponse.body;
                        }
                        else {
                            fileBuffer = fileResponse;
                        }
                    }
                    else {
                        fileBuffer = fileResponse;
                    }
                    if (!fileBuffer) {
                        throw new Error('Não foi possível extrair o conteúdo do arquivo da resposta');
                    }
                    let base64Data;
                    try {
                        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
                        base64Data = buffer.toString('base64');
                    }
                    catch (bufferError) {
                        throw new Error(`Falha ao processar o arquivo: ${bufferError.message}`);
                    }
                    let mimeType = 'application/octet-stream';
                    const fileExtension = (_a = statusResponse.resourceFileExtension) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    if (fileExtension === '.pdf') {
                        mimeType = 'application/pdf';
                    }
                    else if (fileExtension === '.png') {
                        mimeType = 'image/png';
                    }
                    else if (fileExtension === '.pptx') {
                        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                    }
                    else if (fileExtension === '.xlsx') {
                        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    }
                    returnData.push({
                        json: {
                            ...statusResponse,
                            fileBase64: base64Data,
                        },
                        binary: {
                            data: {
                                mimeType,
                                data: base64Data,
                                fileName: `${statusResponse.reportName}${statusResponse.resourceFileExtension || ''}`,
                            }
                        }
                    });
                }
                catch (downloadError) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), downloadError, {
                        message: 'Falha ao baixar o arquivo exportado',
                        description: 'O relatório foi exportado com sucesso, mas não foi possível baixar o arquivo.'
                    });
                }
            }
            else {
                returnData.push({
                    json: statusResponse,
                });
            }
        }
        else if (exportStatus === 'Failed') {
            let errorDescription = 'Tempo limite excedido ou erro desconhecido';
            if (statusResponse &&
                typeof statusResponse === 'object' &&
                statusResponse.error &&
                typeof statusResponse.error === 'object' &&
                statusResponse.error.message) {
                errorDescription = statusResponse.error.message;
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), statusResponse, {
                message: 'Falha na exportação do relatório',
                description: errorDescription,
            });
        }
        else {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), statusResponse, {
                message: 'Tempo limite excedido',
                description: `A exportação não foi concluída dentro do tempo máximo de espera (${maxWaitTime} segundos)`,
            });
        }
        return returnData;
    }
    catch (error) {
        if (error.response &&
            error.response.data &&
            error.response.data.error &&
            error.response.data.error.code === 'FeatureNotAvailableError') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error.response.data, {
                message: 'Recurso de exportação não disponível',
                description: 'A API de exportação para este formato não está disponível para este relatório ou sua licença do Power BI não permite esta operação. Verifique se você tem as permissões necessárias e se o relatório suporta o formato solicitado.',
                httpCode: '404',
            });
        }
        else if (error.response && error.response.data) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error.response.data, {
                message: `Status: ${error.response.status || 'Erro'}`,
                description: `Falha na comunicação com a API do Power BI: ${JSON.stringify(error.response.data)}`,
                httpCode: error.response.status ? error.response.status.toString() : '500',
            });
        }
        throw error;
    }
}
exports.exportToFile = exportToFile;
//# sourceMappingURL=exportToFile.js.map