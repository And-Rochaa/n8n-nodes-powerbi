import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Executa a operação getScanResult para obter o resultado de um scan administrativo
 */
export async function getScanResult(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const scanId = this.getNodeParameter('scanId', i) as string;
	
	// Fazer requisição para obter o resultado do scan
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/admin/workspaces/scanResult/${scanId}`,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
