import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasourceStatus(
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

	// Obter token de autenticação
	let authToken = this.getNodeParameter('authToken', index) as string;
	
	// Remover o prefixo "Bearer" se já estiver presente no token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Preparar o header de autorização
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{},
			{},
			headers,
		);

		const executionData = this.helpers.constructExecutionMetaData(
			[{ json: responseData as IDataObject }],
			{ itemData: { item: index } },
		);

		return executionData;
	} catch (error) {
		if (error.httpCode === '403') {
			throw new Error(
				`Erro 403: Você não tem permissão para verificar o status desta fonte de dados (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Verifique se você tem acesso de administrador ao gateway e à fonte de dados.`
			);
		}
		
		if (error.httpCode === '404') {
			throw new Error(
				`Erro 404: Gateway (${gatewayId}) ou fonte de dados (${datasourceId}) não encontrado. Verifique se os IDs estão corretos e se você tem acesso a eles.`
			);
		}

		throw new Error(
			`Erro ao verificar status da fonte de dados: ${error.message || error}`
		);
	}
}
