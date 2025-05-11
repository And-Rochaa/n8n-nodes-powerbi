import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Obtém um dashboard específico pelo ID
 */
export async function get(
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
	const dashboardId = this.getNodeParameter('dashboardId', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/dashboards/${dashboardId}` : `/dashboards/${dashboardId}`;
	
	// Fazer requisição para a API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
