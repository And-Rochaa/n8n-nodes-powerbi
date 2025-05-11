import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lista todos os grupos (workspaces)
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Fazer requisição à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		'/groups',
	) as JsonObject;
	
	// Processar os dados da resposta
	const groupItems = (responseData.value as IDataObject[] || []);
	for (const item of groupItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
