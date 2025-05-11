import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

/**
 * Obtém um token de acesso usando o código de autorização
 */
export async function getToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Recuperar os parâmetros fornecidos pelo usuário
	const tokenUrl = this.getNodeParameter('tokenUrl', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;
	const code = this.getNodeParameter('code', i) as string;
	const redirectUri = this.getNodeParameter('redirectUri', i) as string;
	const grantType = this.getNodeParameter('grantType', i) as string;
	const scope = this.getNodeParameter('scope', i) as string;
		try {
		// Configuração da requisição
		const options = {
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: redirectUri,
				grant_type: grantType,
				scope,
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
			refresh_token: response.refresh_token,
			scope: response.scope,
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
		throw new Error(`Falha ao obter token: ${error.message}`);
	}
}
