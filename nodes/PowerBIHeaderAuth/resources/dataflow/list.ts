import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function list(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID é obrigatório!');
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

	try {
		const endpoint = `/groups/${groupId}/dataflows`;
		
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{}, // body
			{}, // qs
			headers, // headers
		);

		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((dataflow: IDataObject) => ({
				json: dataflow,
			}));
		}

		return [{ json: responseData }];
	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Acesso negado. Verifique se você tem permissões para acessar este workspace e se o workspace suporta dataflows.');
		}
		throw new NodeOperationError(this.getNode(), `Erro ao obter dataflows: ${error.message}`);
	}
}
