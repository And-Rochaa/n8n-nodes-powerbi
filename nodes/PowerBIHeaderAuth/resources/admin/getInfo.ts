import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Obtém informações detalhadas dos workspaces
 */
export async function getInfo(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter token de autenticação
	let authToken = this.getNodeParameter('authToken', i) as string;
	
	// Remover o prefixo "Bearer" se já estiver presente no token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Preparar o header de autorização
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};
	
	// Obter workspaces selecionados
	const workspaces = this.getNodeParameter('workspaces', i) as string[];
	
	// Verificar se os workspaces foram selecionados
	if (!workspaces || workspaces.length === 0) {
		throw new Error('É necessário selecionar pelo menos um workspace');
	}
	
	// Obter opções
	const datasetSchema = this.getNodeParameter('datasetSchema', i, false) as boolean;
	const datasetExpressions = this.getNodeParameter('datasetExpressions', i, false) as boolean;
	const lineage = this.getNodeParameter('lineage', i, false) as boolean;
	const datasourceDetails = this.getNodeParameter('datasourceDetails', i, false) as boolean;
			
	// Construir query parameters
	const queryParameters: IDataObject = {
		datasetSchema: datasetSchema ? 'True' : 'False',
		datasetExpressions: datasetExpressions ? 'True' : 'False',
		lineage: lineage ? 'True' : 'False',
		datasourceDetails: datasourceDetails ? 'True' : 'False',
	};
	
	// Fazer a requisição para o endpoint de administração com método POST
	const options: IHttpRequestOptions = {
		method: 'POST',
		body: { workspaces },
		qs: queryParameters,
		url: 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo',
		json: true,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};
	
	// Usar a requisição HTTP direta
	const responseData = await this.helpers.request(options);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
