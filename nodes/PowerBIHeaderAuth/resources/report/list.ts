import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Lista todos os relatórios disponíveis
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
	
	// Obter parâmetros
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports` : `/reports`;
	
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
	const reportItems = (responseData.value as IDataObject[] || []);
	for (const item of reportItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
