import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

/**
 * Renova um token de acesso usando um refresh token
 */
export async function refreshToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	try {
		// Recuperar os parâmetros fornecidos pelo usuário
		const tokenUrl = this.getNodeParameter('tokenUrl', i) as string;
		const clientId = this.getNodeParameter('clientId', i) as string;
		const clientSecret = this.getNodeParameter('clientSecret', i) as string;
		const refreshToken = this.getNodeParameter('refreshToken', i) as string;
		const redirectUri = this.getNodeParameter('redirectUri', i) as string;
		const grantType = this.getNodeParameter('grantType', i, 'refresh_token') as string;
		const scope = this.getNodeParameter('scope', i, 'https://analysis.windows.net/powerbi/api/.default offline_access') as string;
		
		// Preparar os dados do formulário para a solicitação POST
		const formData = new URLSearchParams();
		formData.append('client_id', clientId);
		formData.append('client_secret', clientSecret);
		formData.append('refresh_token', refreshToken);
		formData.append('redirect_uri', redirectUri);
		formData.append('grant_type', grantType);
		formData.append('scope', scope);
		
		// Fazer a solicitação para obter o token
		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});
		
		// Verificar se a resposta foi bem-sucedida
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Falha ao renovar o token: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
		}
		
		// Processar e retornar os dados do token
		const tokenData = await response.json();
		
		returnData.push({
			json: tokenData,
		});
		
		return returnData;
	} catch (error) {
		// Lidar com erros
		if (error.response) {
			const errorMessage = `Erro na solicitação: ${error.response.statusCode} - ${error.response.statusMessage}`;
			throw new Error(errorMessage);
		}
		throw error;
	}
}
