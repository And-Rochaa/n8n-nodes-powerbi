import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Executes the getScanResult operation to retrieve the result of an administrative scan
 */
export async function getScanResult(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const scanId = this.getNodeParameter('scanId', i) as string;
	
	// Make request to get the scan result
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/admin/workspaces/scanResult/${scanId}`,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
