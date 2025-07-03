import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const dataflowId = this.getNodeParameter('dataflowId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID é obrigatório!');
	}

	if (!dataflowId) {
		throw new NodeOperationError(this.getNode(), 'Dataflow ID é obrigatório!');
	}

	try {
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

		const endpoint = `/groups/${groupId}/dataflows/${dataflowId}`;
		
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{},
			{},
			headers,
		);

		// A API retorna a definição do dataflow como JSON
		return [{ json: responseData }];
	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Acesso negado. Verifique se você tem permissões para acessar este dataflow.');
		}
		if (error.statusCode === 404) {
			throw new NodeOperationError(this.getNode(), 'Dataflow não encontrado. Verifique se o ID está correto.');
		}
		throw new NodeOperationError(this.getNode(), `Erro ao obter dataflow: ${error.message}`);
	}
}
