import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function getDatasourceUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const datasourceId = this.getNodeParameter('datasourceId', index) as string;

	if (!gatewayId) {
		throw new Error('Gateway ID é obrigatório');
	}

	if (!datasourceId) {
		throw new Error('Datasource ID é obrigatório');
	}

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;

	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		// Se a resposta contém uma propriedade 'value', retornar os itens individuais
		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((user: any) => ({
				json: user,
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
		throw new Error(`Erro ao obter usuários da fonte de dados (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Verifique se você tem permissões de administrador no gateway e se os IDs estão corretos.`);
	}
}
