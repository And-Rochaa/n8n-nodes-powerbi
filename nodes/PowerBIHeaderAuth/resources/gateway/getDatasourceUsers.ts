import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

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

	// Obter o token de autenticação
	let authToken = '';
	try {
		// Primeiro tenta pegar do parâmetro de entrada
		const inputData = this.getInputData();
		if (inputData[index]?.json?.access_token) {
			authToken = inputData[index].json.access_token as string;
		} else {
			// Se não encontrar na entrada, pega do parâmetro do nó
			authToken = this.getNodeParameter('authToken', index) as string;
		}
	} catch (error) {
		throw new Error('Falha ao obter token de autenticação');
	}

	if (!authToken) {
		throw new Error('Token de autenticação é obrigatório');
	}

	// Remover o prefixo "Bearer" se já estiver presente no token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}

	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			undefined,
			undefined,
			headers,
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
