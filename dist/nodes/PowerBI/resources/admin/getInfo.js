"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function getInfo(i) {
    const returnData = [];
    const workspaces = this.getNodeParameter('workspaces', i);
    if (!workspaces || workspaces.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'You must select at least one workspace');
    }
    const datasetSchema = this.getNodeParameter('datasetSchema', i);
    const datasetExpressions = this.getNodeParameter('datasetExpressions', i);
    const lineage = this.getNodeParameter('lineage', i);
    const datasourceDetails = this.getNodeParameter('datasourceDetails', i);
    const getArtifactUsers = false;
    const url = 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo';
    const queryString = [
        `datasetSchema=${datasetSchema ? 'True' : 'False'}`,
        `datasetExpressions=${datasetExpressions ? 'True' : 'False'}`,
        `lineage=${lineage ? 'True' : 'False'}`,
        `datasourceDetails=${datasourceDetails ? 'True' : 'False'}`,
    ].join('&');
    const fullUrl = `${url}?${queryString}`;
    const requestBody = { workspaces };
    const options = {
        method: 'POST',
        body: requestBody,
        uri: fullUrl,
        json: true,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBiApiOAuth2Api', options);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.getInfo = getInfo;
//# sourceMappingURL=getInfo.js.map