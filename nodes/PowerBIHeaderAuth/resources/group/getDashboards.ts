import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Obtém todos os dashboards de um grupo/workspace
 */
export async function getDashboards(
	this: IExecuteFunctions,
	i: number
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
	};
	
	// Obter parâmetros
	const groupId = this.getNodeParameter('groupId', i) as string;
	
	// Construir endpoint
	const endpoint = `/groups/${groupId}/dashboards`;
	
	// Fazer requisição para a API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	) as JsonObject;
	
	// Processar os dados de resposta
	const dashboardItems = (responseData.value as IDataObject[] || []);
	for (const item of dashboardItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
