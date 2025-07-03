import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lista todos os gateways para os quais o usuário é administrador
 */
export async function list(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		// Fazer solicitação para listar gateways
		const response = await powerBiApiRequest.call(
			this,
			'GET',
			'/gateways',
		);

		// Verificar se há gateways na resposta
		if (response.value && Array.isArray(response.value)) {
			// Retornar cada gateway como um item separado
			response.value.forEach((gateway: any) => {
				returnData.push({
					json: gateway,
				});
			});
		} else {
			// Se não há gateways, retornar objeto vazio
			returnData.push({
				json: {
					message: 'Nenhum gateway encontrado',
					value: [],
				},
			});
		}

		return returnData;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new NodeApiError(this.getNode(), error.response.data, { 
				message: `Status: ${error.response.status || 'Erro'}`,
				description: `Falha ao listar gateways: ${JSON.stringify(error.response.data)}`,
				httpCode: error.response.status ? error.response.status.toString() : '500',
			});
		}
		throw error;
	}
}
