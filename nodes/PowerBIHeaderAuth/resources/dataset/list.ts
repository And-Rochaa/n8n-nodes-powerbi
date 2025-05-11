import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Lista todos os datasets
 */
export async function list(
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
	
	// Obter grupo (workspace) ID se fornecido
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir o endpoint com base em se um grupo ID é fornecido
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets` : '/datasets';
	
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
	const datasetItems = (responseData.value as IDataObject[] || []);
	for (const item of datasetItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
