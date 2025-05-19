import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

/**
 * Obtém um token de acesso usando credenciais de Service Principal
 */
export async function getServicePrincipalToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Recuperar os parâmetros fornecidos pelo usuário
	const tenantId = this.getNodeParameter('tenantId', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;	const resource = this.getNodeParameter('apiResource', i, 'https://analysis.windows.net/powerbi/api') as string;
	const grantType = this.getNodeParameter('grantType', i, 'client_credentials') as string;
	
	try {
		// Construir a URL do token
		const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
		
		// Configuração da requisição
		const options = {
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				grant_type: grantType,
				client_id: clientId,
				client_secret: clientSecret,
				resource: resource,
			},
			json: true,
		};
		
		// Realizar a requisição HTTP
		const response = await this.helpers.request(options) as JsonObject;
		
		// Verificar se a resposta contém um token de acesso
		if (!response.access_token) {
			throw new Error('A resposta não contém um token de acesso válido');
		}
		
		// Construir objeto de retorno com os dados do token
		const responseData: IDataObject = {
			access_token: response.access_token,
			token_type: response.token_type || 'Bearer',
			expires_in: response.expires_in,
			expires_on: response.expires_on,
			resource: response.resource,
			ext_expires_in: response.ext_expires_in,
		};
		
		// Retornar os dados do token
		returnData.push({
			json: responseData,
		});
		
		return returnData;
	} catch (error) {
		// Tratar erros de forma mais informativa
		if (error.response) {
			const errorMessage = error.response.data?.error_description || 
								 error.response.data?.error || 
								 'Erro na obtenção do token';
			throw new Error(`Erro na requisição do token: ${errorMessage}`);
		}
		throw new Error(`Falha ao obter token do Service Principal: ${error.message}`);
	}
}
