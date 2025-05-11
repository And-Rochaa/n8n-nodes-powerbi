import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Adiciona linhas a uma tabela em um dataset
 */
export async function addRows(
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
	const tableName = this.getNodeParameter('tableName', i) as string;
	const data = this.getNodeParameter('data', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	let rows;
	try {
		rows = JSON.parse(data);
	} catch (error) {
		throw new Error(`Não foi possível analisar o JSON das linhas: ${error}`);
	}
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
	
	// Fazer requisição para a API
	await powerBiApiRequestWithHeaders.call(
		this,
		'POST',
		endpoint,
		{
			rows,
		},
		{},
		headers,
	);
	
	returnData.push({
		json: { success: true, message: 'Linhas adicionadas com sucesso' },
	});
	
	return returnData;
}
