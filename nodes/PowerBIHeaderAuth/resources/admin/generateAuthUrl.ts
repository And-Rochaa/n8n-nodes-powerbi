import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

/**
 * Gera uma URL de autenticação OAuth2 para o Microsoft Entra ID
 */
export async function generateAuthUrl(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Recuperar os parâmetros fornecidos pelo usuário
	const baseUrl = this.getNodeParameter('url', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const responseType = this.getNodeParameter('responseType', i) as string;
	const redirectUri = this.getNodeParameter('redirectUri', i) as string;
	const responseMode = this.getNodeParameter('responseMode', i) as string;
	const scope = this.getNodeParameter('scope', i) as string;
	const state = this.getNodeParameter('state', i, '') as string;
	
	// Construir a URL de autenticação
	let authUrl = `${baseUrl}?client_id=${encodeURIComponent(clientId)}&response_type=${encodeURIComponent(responseType)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=${encodeURIComponent(responseMode)}&scope=${encodeURIComponent(scope)}`;
	
	// Adicionar state se fornecido
	if (state) {
		authUrl += `&state=${encodeURIComponent(state)}`;
	}
	
	// Retornar a URL gerada
	returnData.push({
		json: {
			authUrl,
			baseUrl,
			clientId,
			responseType,
			redirectUri,
			responseMode,
			scope,
			state,
		},
	});
	
	return returnData;
}
