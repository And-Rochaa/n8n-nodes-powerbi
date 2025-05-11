import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém dashboards de um grupo específico
 */
export async function getDashboards(
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
		`/groups/${groupId}/dashboards`,
	) as JsonObject;
	
	// Processar os dados da resposta
	const dashboardItems = (responseData.value as IDataObject[] || []);
	for (const item of dashboardItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
