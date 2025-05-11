import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

// Interfaces para os tipos do Power BI
interface IPageBookmark {
	name?: string;
	state?: string;
}

interface IExportFilter {
	filter: string;
}

interface IExportReportPage {
	pageName: string;
	visualName?: string;
	bookmark?: IPageBookmark;
}

interface IExportReportSettings {
	includeHiddenPages?: boolean;
	locale?: string;
}

interface IPaginatedReportExportConfiguration {
	formatSettings?: { [key: string]: any };
	identities?: IEffectiveIdentity[];
	locale?: string;
	parameterValues?: IParameterValue[];
}

interface IParameterValue {
	name: string;
	value: string;
}

interface IPowerBIReportExportConfiguration {
	datasetToBind?: string;
	defaultBookmark?: IPageBookmark;
	identities?: IEffectiveIdentity[];
	pages?: IExportReportPage[];
	reportLevelFilters?: IExportFilter[];
	settings?: IExportReportSettings;
}

interface IEffectiveIdentity {
	username?: string;
	roles?: string[];
	datasets?: string[];
	customData?: string;
	identityBlob?: { value: string };
	auditableContext?: string;
	reports?: string[];
}

/**
 * Exporta um relatório do Power BI para vários formatos de arquivo
 */
export async function exportToFile(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter token de autenticação
	let authToken = this.getNodeParameter('authToken', i) as string;
	
	// Remover o prefixo "Bearer" se já estiver presente no token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Preparar o header de autorização
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};	// Obter parâmetros básicos
	const reportId = this.getNodeParameter('reportId', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const exportFormat = this.getNodeParameter('exportFormat', i, 'PDF') as string;
	const waitForCompletion = this.getNodeParameter('waitForCompletion', i, true) as boolean;
	const downloadFile = this.getNodeParameter('downloadFile', i, false) as boolean;
	
	// Obter campos adicionais
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const maxWaitTime = (additionalFields.maxWaitTime as number) || 300; // tempo máximo em segundos
	const pollingInterval = (additionalFields.pollingInterval as number) || 5; // intervalo de polling em segundos
	
	// Construir endpoint baseado no grupo selecionado
	const exportEndpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
	
	// Preparar corpo da solicitação
	const body: IDataObject = {
		format: exportFormat,
	};
	
	// Verificar se é um relatório do Power BI ou paginado
	const reportType = this.getNodeParameter('reportType', i, 'powerBI') as string;
		if (reportType === 'powerBI') {
		// Configurações para relatórios do Power BI
		const powerBIConfig: IPowerBIReportExportConfiguration = {};
		
		// Obter configurações do relatório Power BI da coleção
		const powerBIReportConfig = this.getNodeParameter('powerBIReportConfig', i, {}) as IDataObject;
		
		// Configurações básicas
		if (powerBIReportConfig.includeHiddenPages !== undefined || powerBIReportConfig.locale) {
			powerBIConfig.settings = {};
			
			if (powerBIReportConfig.includeHiddenPages !== undefined) {
				powerBIConfig.settings.includeHiddenPages = powerBIReportConfig.includeHiddenPages as boolean;
			}
			
			if (powerBIReportConfig.locale) {
				powerBIConfig.settings.locale = powerBIReportConfig.locale as string;
			}
		}
				// Verificar se há páginas específicas para exportar
		if (powerBIReportConfig.exportSpecificPages === true && powerBIReportConfig.pages) {
			try {
				const pages: IExportReportPage[] = JSON.parse(powerBIReportConfig.pages as string);
				if (pages.length > 0) {
					powerBIConfig.pages = pages;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para páginas', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
				// Verificar se há filtros de nível de relatório
		if (powerBIReportConfig.useReportLevelFilters === true && powerBIReportConfig.reportLevelFilters) {
			try {
				const filters: IExportFilter[] = JSON.parse(powerBIReportConfig.reportLevelFilters as string);
				if (filters.length > 0) {
					powerBIConfig.reportLevelFilters = filters;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para filtros', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
				// Verificar se há um bookmark padrão
		if (powerBIReportConfig.useDefaultBookmark === true) {
			const bookmarkName = powerBIReportConfig.defaultBookmarkName as string;
			const bookmarkState = powerBIReportConfig.defaultBookmarkState as string;
			
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
				// Verificar se há um dataset alternativo para vincular
		if (powerBIReportConfig.useAlternativeDataset === true) {
			const datasetId = powerBIReportConfig.datasetToBind as string;
			if (datasetId) {
				powerBIConfig.datasetToBind = datasetId;
			}
		}
				// Verificar se deve usar identidades para RLS (Row-Level Security)
		if (powerBIReportConfig.useIdentities === true && powerBIReportConfig.identities) {
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(powerBIReportConfig.identities as string);
				if (identities.length > 0) {
					powerBIConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para identidades', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
		
		// Adicionar configurações do Power BI se existirem
		if (Object.keys(powerBIConfig).length > 0) {
			body.powerBIReportConfiguration = powerBIConfig;
		}	} else {
		// Configurações para relatórios paginados
		const paginatedConfig: IPaginatedReportExportConfiguration = {};
		
		// Obter configurações do relatório paginado da coleção
		const paginatedReportConfig = this.getNodeParameter('paginatedReportConfig', i, {}) as IDataObject;
		
		// Configuração de locale
		if (paginatedReportConfig.locale) {
			paginatedConfig.locale = paginatedReportConfig.locale as string;
		}
		
		// Parâmetros do relatório
		if (paginatedReportConfig.useParameters === true && paginatedReportConfig.parameterValues) {
			try {
				const parameters: IParameterValue[] = JSON.parse(paginatedReportConfig.parameterValues as string);
				if (parameters.length > 0) {
					paginatedConfig.parameterValues = parameters;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para parâmetros', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
				// Configurações de formato
		if (paginatedReportConfig.useFormatSettings === true && paginatedReportConfig.formatSettings) {
			try {
				const formatSettings = JSON.parse(paginatedReportConfig.formatSettings as string);
				if (Object.keys(formatSettings).length > 0) {
					paginatedConfig.formatSettings = formatSettings;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para configurações de formato', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
		
		// Identidades RLS para relatórios paginados
		if (paginatedReportConfig.useIdentities === true && paginatedReportConfig.identities) {
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(paginatedReportConfig.identities as string);
				if (identities.length > 0) {
					paginatedConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Formato JSON inválido para identidades', {
					description: 'Certifique-se de que o formato JSON está correto.',
				});
			}
		}
		
		// Adicionar configurações do relatório paginado se existirem
		if (Object.keys(paginatedConfig).length > 0) {
			body.paginatedReportConfiguration = paginatedConfig;
		}
	}
	try {
		// Iniciar o trabalho de exportação
		const exportResponse = await powerBiApiRequestWithHeaders.call(
			this,
			'POST',
			exportEndpoint,
			body,
			{},
			headers,
		);		
		const exportId = exportResponse.id;
		
		if (!waitForCompletion) {
			// Retornar os detalhes do trabalho de exportação imediatamente
			returnData.push({
				json: exportResponse,
			});
			return returnData;
		}
		
		// Construir endpoint para verificar o status da exportação
		const statusEndpoint = groupId && groupId !== 'me' ? 
			`/groups/${groupId}/reports/${reportId}/exports/${exportId}` : `/reports/${reportId}/exports/${exportId}`;
		
		// Polling para verificar o status do trabalho de exportação
		let exportStatus = exportResponse.status;
		let statusResponse = exportResponse;
		let elapsedTime = 0;
		
		while (exportStatus !== 'Succeeded' && exportStatus !== 'Failed' && elapsedTime < maxWaitTime) {
			// Aguardar o intervalo de polling antes da próxima verificação
			await new Promise(resolve => setTimeout(resolve, pollingInterval * 1000));
			elapsedTime += pollingInterval;
			
			// Verificar o status atual do trabalho de exportação
			statusResponse = await powerBiApiRequestWithHeaders.call(
				this,
				'GET',
				statusEndpoint,
				{},
				{},
				headers,
			);
			
			exportStatus = statusResponse.status;
		}
		// Verificar o resultado final
		if (exportStatus === 'Succeeded') {
			// Verificar se é necessário baixar o arquivo
			const downloadFile = this.getNodeParameter('downloadFile', i, false) as boolean;
			
			if (downloadFile && statusResponse.resourceLocation) {				try {
					// Fazer uma solicitação GET para baixar o arquivo
					const fileResponse = await powerBiApiRequestWithHeaders.call(
						this,
						'GET',
						statusResponse.resourceLocation.replace('https://api.powerbi.com/v1.0/myorg', ''),
						{},
						{},
						headers,
						{ encoding: null, json: false, returnFullResponse: true },
					);
					
					// Verificar se a resposta contém o corpo do arquivo
					if (!fileResponse || typeof fileResponse !== 'object') {
						throw new Error('Resposta inválida ao baixar o arquivo');
					}					// Extrair o corpo da resposta que contém o buffer do arquivo com verificação extra
					let fileBuffer;
							if (fileResponse && typeof fileResponse === 'object') {
						if (Buffer.isBuffer(fileResponse)) {
							fileBuffer = fileResponse;
						} else if ('body' in fileResponse && fileResponse.body) {
							fileBuffer = fileResponse.body;
						} else {
							fileBuffer = fileResponse;
						}
					} else {
						fileBuffer = fileResponse;
					}
					
					// Verificação final e conversão segura para Buffer
					if (!fileBuffer) {
						throw new Error('Não foi possível extrair o conteúdo do arquivo da resposta');
					}
					
					// Converter para Buffer com tratamento de erro
					let base64Data;					try {
						const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
						base64Data = buffer.toString('base64');
					} catch (bufferError: any) {
						throw new Error(`Falha ao processar o arquivo: ${bufferError.message}`);
					}
					
					// Determinar o tipo MIME com base na extensão do arquivo
					let mimeType = 'application/octet-stream'; // Padrão
					const fileExtension = statusResponse.resourceFileExtension?.toLowerCase();
					
					if (fileExtension === '.pdf') {
						mimeType = 'application/pdf';
					} else if (fileExtension === '.png') {
						mimeType = 'image/png';
					} else if (fileExtension === '.pptx') {
						mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
					} else if (fileExtension === '.xlsx') {
						mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
					}
							// Retornar os dados do status e o arquivo em base64
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
					});				} catch (downloadError) {
					throw new NodeApiError(this.getNode(), downloadError, {
						message: 'Falha ao baixar o arquivo exportado',
						description: 'O relatório foi exportado com sucesso, mas não foi possível baixar o arquivo.'
					});
				}
			} else {
				// Retornar apenas os dados do status sem baixar o arquivo
				returnData.push({
					json: statusResponse,
				});
			}
		} else if (exportStatus === 'Failed') {
			let errorDescription = 'Tempo limite excedido ou erro desconhecido';
			
			// Verificar se statusResponse tem a propriedade error e se esta tem a propriedade message
			if (statusResponse && 
				typeof statusResponse === 'object' && 
				statusResponse.error && 
				typeof statusResponse.error === 'object' &&
				statusResponse.error.message) {
				errorDescription = statusResponse.error.message;
			}
			
			throw new NodeApiError(this.getNode(), statusResponse, {
				message: 'Falha na exportação do relatório',
				description: errorDescription,
			});
		} else {
			throw new NodeApiError(this.getNode(), statusResponse, {
				message: 'Tempo limite excedido',
				description: `A exportação não foi concluída dentro do tempo máximo de espera (${maxWaitTime} segundos)`,
			});
		}
		
		return returnData;	} catch (error) {
		
		// Verificar se é um erro específico de feature não disponível
		if (error.response && 
			error.response.data && 
			error.response.data.error && 
			error.response.data.error.code === 'FeatureNotAvailableError') {
			
			throw new NodeApiError(this.getNode(), error.response.data, {
				message: 'Recurso de exportação não disponível',
				description: 'A API de exportação para este formato não está disponível para este relatório ou sua licença do Power BI não permite esta operação. Verifique se você tem as permissões necessárias e se o relatório suporta o formato solicitado.',
				httpCode: '404',
			});
		} else if (error.response && error.response.data) {
			throw new NodeApiError(this.getNode(), error.response.data, { 
				message: `Status: ${error.response.status || 'Erro'}`,
				description: `Falha na comunicação com a API do Power BI: ${JSON.stringify(error.response.data)}`,
				httpCode: error.response.status ? error.response.status.toString() : '500',
			});
		}
		throw error;
	}
}
