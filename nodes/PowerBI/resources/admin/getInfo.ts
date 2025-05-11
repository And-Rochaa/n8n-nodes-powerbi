import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

/**
 * Executa a operação getInfo para obter informações detalhadas dos workspaces
 */
export async function getInfo(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter workspaces selecionados
	const workspaces = this.getNodeParameter('workspaces', i) as string[];
	
	// Verificar se os workspaces foram selecionados
	if (!workspaces || workspaces.length === 0) {
		throw new Error('É necessário selecionar pelo menos um workspace');
	}
	
	// Obter opções
	const datasetSchema = this.getNodeParameter('datasetSchema', i) as boolean;
	const datasetExpressions = this.getNodeParameter('datasetExpressions', i) as boolean;
	const lineage = this.getNodeParameter('lineage', i) as boolean;
	const datasourceDetails = this.getNodeParameter('datasourceDetails', i) as boolean;
	const getArtifactUsers = false; // Opcional, não implementado na interface ainda
	
	// Construir URL com query parameters conforme especificado na documentação
	const url = 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo';
	const queryString = [
		`datasetSchema=${datasetSchema ? 'True' : 'False'}`,
		`datasetExpressions=${datasetExpressions ? 'True' : 'False'}`,
		`lineage=${lineage ? 'True' : 'False'}`,
		`datasourceDetails=${datasourceDetails ? 'True' : 'False'}`,
	].join('&');
	
	const fullUrl = `${url}?${queryString}`;
	
	// Configurar corpo da requisição com a lista de workspaces IDs
	const requestBody = { workspaces };
	
	// Fazer a requisição para o endpoint de administração com método POST
	const options = {
		method: 'POST',
		body: requestBody,
		uri: fullUrl,
		json: true,
		headers: {
			'Content-Type': 'application/json',
		},
	};
	
	// Usar autenticação direta para garantir que o método POST seja usado corretamente
	const responseData = await this.helpers.requestWithAuthentication.call(
		this,
		'powerBIApi',
		options
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
