import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function listDataflows(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId) {
		throw new Error('Workspace ID é obrigatório');
	}

	const endpoint = `/groups/${groupId}/dataflows`;

	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		// Se a resposta contém uma propriedade 'value', retornar os itens individuais
		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((dataflow: any) => ({
				json: dataflow,
				pairedItem: { item: index },
			}));
		}

		// Se não há propriedade 'value', retornar a resposta completa
		return [{
			json: responseData,
			pairedItem: { item: index },
		}];

	} catch (error) {
		// Melhor tratamento de erro com mais detalhes
		const errorMessage = error.message || error.toString();
		throw new Error(`Erro ao obter fluxos de dados (Workspace: ${groupId}): ${errorMessage}. Verifique se você tem permissões adequadas no workspace.`);
	}
}
