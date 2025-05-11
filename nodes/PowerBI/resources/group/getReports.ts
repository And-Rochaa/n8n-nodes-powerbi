import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém relatórios de um grupo específico
 */
export async function getReports(
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
		`/groups/${groupId}/reports`,
	) as JsonObject;
	
	// Processar os dados da resposta
	const reportItems = (responseData.value as IDataObject[] || []);
	for (const item of reportItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
