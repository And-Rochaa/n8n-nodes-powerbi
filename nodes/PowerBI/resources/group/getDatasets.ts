import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém datasets de um grupo específico
 */
export async function getDatasets(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter parâmetro de ID do grupo
	const groupId = this.getNodeParameter('groupId', i) as string;
	
	// Fazer requisição à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/groups/${groupId}/datasets`,
	) as JsonObject;
	
	// Processar os dados da resposta
	const datasetItems = (responseData.value as IDataObject[] || []);
	for (const item of datasetItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
