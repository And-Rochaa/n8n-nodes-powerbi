import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Obtém o resultado do escaneamento de um workspace
 */
export async function getScanResult(
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
	
	// Obter ID do scan
	const scanId = this.getNodeParameter('scanId', i) as string;
	
	// Fazer requisição para obter o resultado do scan
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		`/admin/workspaces/scanResult/${scanId}`,
		{},
		{},
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
