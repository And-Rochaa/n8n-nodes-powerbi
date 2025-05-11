import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Atualiza um dataset específico
 */
export async function refresh(
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
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
	
	// Fazer requisição para a API
	await powerBiApiRequestWithHeaders.call(
		this,
		'POST',
		endpoint,
		{},
		{},
		headers,
	);
	
	returnData.push({
		json: { success: true, message: 'Refresh started successfully' },
	});
	
	return returnData;
}
