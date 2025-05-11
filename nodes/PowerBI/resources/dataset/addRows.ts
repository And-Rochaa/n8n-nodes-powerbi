import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Adiciona linhas a uma tabela em um dataset
 */
export async function addRows(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const tableName = this.getNodeParameter('tableName', i) as string;
	const data = this.getNodeParameter('data', i) as string;
	
	let rows;
	try {
		rows = JSON.parse(data);
	} catch (error) {
		throw new Error(`Não foi possível analisar o JSON das linhas: ${error}`);
	}
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
	
	// Make API call
	await powerBiApiRequest.call(
		this,
		'POST',
		endpoint,
		{
			rows,
		},
	);
	
	returnData.push({
		json: { success: true, message: 'Linhas adicionadas com sucesso' },
	});
	
	return returnData;
}
