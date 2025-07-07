import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

// Interfaces for Power BI types
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
 * Exports a Power BI report to various file formats
 */
export async function exportToFile(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get authentication token
	let authToken = this.getNodeParameter('authToken', i) as string;
	
	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Prepare the authorization header
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};	// Get basic parameters
	const reportId = this.getNodeParameter('reportId', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const exportFormat = this.getNodeParameter('exportFormat', i, 'PDF') as string;
	const waitForCompletion = this.getNodeParameter('waitForCompletion', i, true) as boolean;
	const downloadFile = this.getNodeParameter('downloadFile', i, false) as boolean;
	
	// Get additional fields
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const maxWaitTime = (additionalFields.maxWaitTime as number) || 300; // maximum time in seconds
	const pollingInterval = (additionalFields.pollingInterval as number) || 5; // polling interval in seconds
	
	// Build endpoint based on selected group
	const exportEndpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
	
	// Prepare request body
	const body: IDataObject = {
		format: exportFormat,
	};
	
	// Check if it's a Power BI or paginated report
	const reportType = this.getNodeParameter('reportType', i, 'powerBI') as string;
		if (reportType === 'powerBI') {
		// Configuration for Power BI reports
		const powerBIConfig: IPowerBIReportExportConfiguration = {};
		
		// Get Power BI report configuration from collection
		const powerBIReportConfig = this.getNodeParameter('powerBIReportConfig', i, {}) as IDataObject;
		
		// Basic configuration
		if (powerBIReportConfig.includeHiddenPages !== undefined || powerBIReportConfig.locale) {
			powerBIConfig.settings = {};
			
			if (powerBIReportConfig.includeHiddenPages !== undefined) {
				powerBIConfig.settings.includeHiddenPages = powerBIReportConfig.includeHiddenPages as boolean;
			}
			
			if (powerBIReportConfig.locale) {
				powerBIConfig.settings.locale = powerBIReportConfig.locale as string;
			}
		}
				// Check if there are specific pages to export
		if (powerBIReportConfig.exportSpecificPages === true && powerBIReportConfig.pages) {
			try {
				const pages: IExportReportPage[] = JSON.parse(powerBIReportConfig.pages as string);
				if (pages.length > 0) {
					powerBIConfig.pages = pages;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for pages', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
				// Check if there are report-level filters
		if (powerBIReportConfig.useReportLevelFilters === true && powerBIReportConfig.reportLevelFilters) {
			try {
				const filters: IExportFilter[] = JSON.parse(powerBIReportConfig.reportLevelFilters as string);
				if (filters.length > 0) {
					powerBIConfig.reportLevelFilters = filters;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for filters', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
				// Check if there is a default bookmark
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
				// Check if there is an alternative dataset to bind
		if (powerBIReportConfig.useAlternativeDataset === true) {
			const datasetId = powerBIReportConfig.datasetToBind as string;
			if (datasetId) {
				powerBIConfig.datasetToBind = datasetId;
			}
		}
				// Check if should use identities for RLS (Row-Level Security)
		if (powerBIReportConfig.useIdentities === true && powerBIReportConfig.identities) {
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(powerBIReportConfig.identities as string);
				if (identities.length > 0) {
					powerBIConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for identities', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
		
		// Add Power BI configuration if it exists
		if (Object.keys(powerBIConfig).length > 0) {
			body.powerBIReportConfiguration = powerBIConfig;
		}	} else {
		// Configuration for paginated reports
		const paginatedConfig: IPaginatedReportExportConfiguration = {};
		
		// Get paginated report configuration from collection
		const paginatedReportConfig = this.getNodeParameter('paginatedReportConfig', i, {}) as IDataObject;
		
		// Locale configuration
		if (paginatedReportConfig.locale) {
			paginatedConfig.locale = paginatedReportConfig.locale as string;
		}
		
		// Report parameters
		if (paginatedReportConfig.useParameters === true && paginatedReportConfig.parameterValues) {
			try {
				const parameters: IParameterValue[] = JSON.parse(paginatedReportConfig.parameterValues as string);
				if (parameters.length > 0) {
					paginatedConfig.parameterValues = parameters;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for parameters', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
				// Format settings
		if (paginatedReportConfig.useFormatSettings === true && paginatedReportConfig.formatSettings) {
			try {
				const formatSettings = JSON.parse(paginatedReportConfig.formatSettings as string);
				if (Object.keys(formatSettings).length > 0) {
					paginatedConfig.formatSettings = formatSettings;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for format settings', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
		
		// RLS identities for paginated reports
		if (paginatedReportConfig.useIdentities === true && paginatedReportConfig.identities) {
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(paginatedReportConfig.identities as string);
				if (identities.length > 0) {
					paginatedConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for identities', {
					description: 'Make sure the JSON format is correct.',
				});
			}
		}
		
		// Add paginated report configuration if it exists
		if (Object.keys(paginatedConfig).length > 0) {
			body.paginatedReportConfiguration = paginatedConfig;
		}
	}
	try {
		// Start the export job
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
			// Return export job details immediately
			returnData.push({
				json: exportResponse,
			});
			return returnData;
		}
		
		// Build endpoint to check export status
		const statusEndpoint = groupId && groupId !== 'me' ? 
			`/groups/${groupId}/reports/${reportId}/exports/${exportId}` : `/reports/${reportId}/exports/${exportId}`;
		
		// Polling to check export job status
		let exportStatus = exportResponse.status;
		let statusResponse = exportResponse;
		let elapsedTime = 0;
		
		while (exportStatus !== 'Succeeded' && exportStatus !== 'Failed' && elapsedTime < maxWaitTime) {
			// Wait for polling interval before next check
			await new Promise(resolve => {
				setTimeout(() => resolve(undefined), pollingInterval * 1000);
			});
			elapsedTime += pollingInterval;
			
			// Check current export job status
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
		// Check final result
		if (exportStatus === 'Succeeded') {
			// Check if file download is needed
			const downloadFile = this.getNodeParameter('downloadFile', i, false) as boolean;
			
			if (downloadFile && statusResponse.resourceLocation) {				try {
					// Make a GET request to download the file
					const fileResponse = await powerBiApiRequestWithHeaders.call(
						this,
						'GET',
						statusResponse.resourceLocation.replace('https://api.powerbi.com/v1.0/myorg', ''),
						{},
						{},
						headers,
						{ encoding: null, json: false, returnFullResponse: true },
					);
					
					// Check if response contains file body
					if (!fileResponse || typeof fileResponse !== 'object') {
						throw new Error('Invalid response when downloading file');
					}					// Extract response body containing file buffer with extra verification
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
					
					// Final verification and safe conversion to Buffer
					if (!fileBuffer) {
						throw new Error('Unable to extract file content from response');
					}
					
					// Convert to Buffer with error handling
					let base64Data;					try {
						const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
						base64Data = buffer.toString('base64');
					} catch (bufferError: any) {
						throw new Error(`Failed to process file: ${bufferError.message}`);
					}
					
					// Determine MIME type based on file extension
					let mimeType = 'application/octet-stream'; // Default
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
							// Return status data and file in base64
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
						message: 'Failed to download exported file',
						description: 'The report was exported successfully, but the file could not be downloaded.'
					});
				}
			} else {
				// Return only status data without downloading file
				returnData.push({
					json: statusResponse,
				});
			}
		} else if (exportStatus === 'Failed') {
			let errorDescription = 'Timeout exceeded or unknown error';
			
			// Check if statusResponse has error property and if it has message property
			if (statusResponse && 
				typeof statusResponse === 'object' && 
				statusResponse.error && 
				typeof statusResponse.error === 'object' &&
				statusResponse.error.message) {
				errorDescription = statusResponse.error.message;
			}
			
			throw new NodeApiError(this.getNode(), statusResponse, {
				message: 'Report export failed',
				description: errorDescription,
			});
		} else {
			throw new NodeApiError(this.getNode(), statusResponse, {
				message: 'Timeout exceeded',
				description: `Export was not completed within the maximum wait time (${maxWaitTime} seconds)`,
			});
		}
		
		return returnData;	} catch (error) {
		
		// Check if it's a specific feature unavailable error
		if (error.response && 
			error.response.data && 
			error.response.data.error && 
			error.response.data.error.code === 'FeatureNotAvailableError') {
			
			throw new NodeApiError(this.getNode(), error.response.data, {
				message: 'Export feature not available',
				description: 'The export API for this format is not available for this report or your Power BI license does not allow this operation. Check that you have the necessary permissions and that the report supports the requested format.',
				httpCode: '404',
			});
		} else if (error.response && error.response.data) {
			throw new NodeApiError(this.getNode(), error.response.data, { 
				message: `Status: ${error.response.status || 'Error'}`,
				description: `Failed to communicate with Power BI API: ${JSON.stringify(error.response.data)}`,
				httpCode: error.response.status ? error.response.status.toString() : '500',
			});
		}
		throw error;
	}
}
