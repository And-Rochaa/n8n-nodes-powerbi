import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

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
	
	// Get basic parameters
	const reportId = this.getNodeParameter('reportId', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const exportFormat = this.getNodeParameter('exportFormat', i) as string;
	const waitForCompletion = this.getNodeParameter('waitForCompletion', i, true) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const maxWaitTime = (additionalFields.maxWaitTime as number) || 600; // maximum wait time in seconds
	const pollingInterval = (additionalFields.pollingInterval as number) || 5; // polling interval in seconds
	
	// Build endpoint based on selected group
	const exportEndpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
	
	// Prepare request body
	const body: IDataObject = {
		format: exportFormat,
	};
	
	// Check if it is a Power BI or paginated report
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
		
		// Check if identities should be used for RLS (Row-Level Security)
		if (powerBIReportConfig.useIdentities === true) {
			const identitiesJson = powerBIReportConfig.identities as string;
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(identitiesJson);
				if (identities.length > 0) {
					powerBIConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for identities', {
					description: 'Please ensure the JSON format is correct.',
				});
			}
		}
		
		// Add Power BI configuration if it exists
		if (Object.keys(powerBIConfig).length > 0) {
			body.powerBIReportConfiguration = powerBIConfig;
		}
	} else {
		// Settings for paginated reports
		const paginatedConfig: IPaginatedReportExportConfiguration = {};
		
		// Locale configuration
		const locale = this.getNodeParameter('locale', i, '') as string;
		if (locale) {
			paginatedConfig.locale = locale;
		}
		
		// Report parameters
		const useParameters = this.getNodeParameter('useParameters', i, false) as boolean;
		
		if (useParameters) {
			const parametersJson = this.getNodeParameter('parameterValues', i, '[]') as string;
			try {
				const parameters: IParameterValue[] = JSON.parse(parametersJson);
				if (parameters.length > 0) {
					paginatedConfig.parameterValues = parameters;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for parameters', {
					description: 'Please ensure the JSON format is correct.',
				});
			}
		}
		
		// Format settings
		const useFormatSettings = this.getNodeParameter('useFormatSettings', i, false) as boolean;
		
		if (useFormatSettings) {
			const formatSettingsJson = this.getNodeParameter('formatSettings', i, '{}') as string;
			try {
				const formatSettings = JSON.parse(formatSettingsJson);
				if (Object.keys(formatSettings).length > 0) {
					paginatedConfig.formatSettings = formatSettings;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for format settings', {
					description: 'Please ensure the JSON format is correct.',
				});
			}
		}
		
		// RLS identities for paginated reports
		const useIdentities = this.getNodeParameter('useIdentities', i, false) as boolean;
		
		if (useIdentities) {
			const identitiesJson = this.getNodeParameter('identities', i, '[]') as string;
			try {
				const identities: IEffectiveIdentity[] = JSON.parse(identitiesJson);
				if (identities.length > 0) {
					paginatedConfig.identities = identities;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON format for identities', {
					description: 'Please ensure the JSON format is correct.',
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
		const exportResponse = await powerBiApiRequest.call(
			this,
			'POST',
			exportEndpoint,
			body,
		);
		
		const exportId = exportResponse.id;
		
		if (!waitForCompletion) {
			// Return export job details immediately
			const executionData = this.helpers.constructExecutionMetaData(
				[{ json: exportResponse }],
				{ itemData: { item: i } }
			);
			returnData.push(...executionData);
			return returnData;
		}
		
		// Build endpoint to check export status
		const statusEndpoint = groupId && groupId !== 'me' ? 
			`/groups/${groupId}/reports/${reportId}/exports/${exportId}` : `/reports/${reportId}/exports/${exportId}`;
		
		// Polling to check the export job status
		let exportStatus = exportResponse.status;
		let statusResponse = exportResponse;
		let elapsedTime = 0;
		
		while (exportStatus !== 'Succeeded' && exportStatus !== 'Failed' && elapsedTime < maxWaitTime) {
			// Wait for the polling interval before the next check
			await new Promise(resolve => {
				let elapsed = 0;
				const check = () => {
					elapsed += 100;
					if (elapsed >= pollingInterval * 1000) {
						resolve(undefined);
					} else {
						Promise.resolve().then(check);
					}
				};
				check();
			});
			elapsedTime += pollingInterval;
			
			// Check the current export job status
			statusResponse = await powerBiApiRequest.call(
				this,
				'GET',
				statusEndpoint,
				{},
			);
			
			exportStatus = statusResponse.status;
		}
		// Check the final result
		if (exportStatus === 'Succeeded') {
			// Check if it is necessary to download the file
			const downloadFile = this.getNodeParameter('downloadFile', i, false) as boolean;
			
			if (downloadFile && statusResponse.resourceLocation) {
				try {					// Make a GET request to download the file
					const fileResponse = await powerBiApiRequest.call(
						this,
						'GET',
						statusResponse.resourceLocation.replace('https://api.powerbi.com/v1.0/myorg', ''),
						{},
						{},
						{ json: false, returnFullResponse: true },
					);
		
					
					// Extract the response body containing the file buffer with extra validation
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
					
					// Final check and safe conversion to Buffer
					if (!fileBuffer) {
						throw new NodeOperationError(this.getNode(), 'Could not extract file content from the response');
					}
					
					// Convert to Buffer with error handling
					let base64Data;					try {
						const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
						base64Data = buffer.toString('base64');
					} catch (bufferError: any) {
						throw new NodeOperationError(this.getNode(), `Failed to process the file: ${bufferError.message}`);
					}
					
					// Determine the MIME type based on the file extension
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
							// Return the status data and the file in base64
					const executionData = this.helpers.constructExecutionMetaData([{
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
					}], { itemData: { item: i } });
					returnData.push(...executionData);				} catch (downloadError) {
					throw new NodeApiError(this.getNode(), downloadError, {
						message: 'Failed to download the exported file',
						description: 'The report was exported successfully, but the file could not be downloaded.'
					});
				}
			} else {
				// Return only the status data without downloading the file
				const executionData = this.helpers.constructExecutionMetaData(
					[{ json: statusResponse }],
					{ itemData: { item: i } }
				);
				returnData.push(...executionData);
			}
		} else if (exportStatus === 'Failed') {
			let errorDescription = 'Timeout exceeded or unknown error';
			
			// Check if statusResponse has the error property and if it has the message property
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
				description: `The export did not complete within the maximum wait time (${maxWaitTime} seconds)`,
			});
		}
				return returnData;	} catch (error) {
		
		// Check if it is a specific error for feature not available
		if (error.response && 
			error.response.data && 
			error.response.data.error && 
			error.response.data.error.code === 'FeatureNotAvailableError') {
			
			throw new NodeApiError(this.getNode(), error.response.data, {
				message: 'Export feature not available',
				description: 'The export API for this format is not available for this report, or your Power BI license does not allow this operation. Please check if you have the necessary permissions and if the report supports the requested format.',
				httpCode: '404',
			});
		} else if (error.response && error.response.data) {
			throw new NodeApiError(this.getNode(), error.response.data, { 
				message: `Status: ${error.response.status || 'Error'}`,
				description: `Failed to communicate with the Power BI API: ${JSON.stringify(error.response.data)}`,
				httpCode: error.response.status ? error.response.status.toString() : '500',
			});
		}
		throw error;
	}
}
