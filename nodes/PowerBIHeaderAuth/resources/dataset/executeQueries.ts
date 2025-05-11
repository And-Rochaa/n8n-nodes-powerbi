import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Executa consultas DAX em um dataset
 */
export async function executeQueries(
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
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const daxQuery = this.getNodeParameter('daxQuery', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
	
	// Fazer requisição para a API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'POST',
		endpoint,
		{
			queries: [
				{
					query: daxQuery,
				},
			],
		},
		{},
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
