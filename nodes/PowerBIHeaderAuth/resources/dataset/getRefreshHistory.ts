import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Obtém o histórico de atualizações de um dataset
 */
export async function getRefreshHistory(
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
	const top = this.getNodeParameter('top', i, undefined) as number | undefined;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir os parâmetros de consulta se top for especificado
	const queryParams: IDataObject = {};
	if (top !== undefined) {
		queryParams.$top = top;
	}
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
	
	// Fazer requisição para a API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		queryParams,
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
