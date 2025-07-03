import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasource(
	this: IExecuteFunctions,
	index: number
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const datasourceId = this.getNodeParameter('datasourceId', index) as string;
	
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
	
	const qs = {};
	
	const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}/datasources/${datasourceId}`, {}, qs, headers);
	
	return this.helpers.returnJsonArray(responseData);
}
