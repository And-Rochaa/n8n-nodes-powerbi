"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
async function getInfo(i) {
    const returnData = [];
    const workspaces = this.getNodeParameter('workspaces', i);
    if (!workspaces || workspaces.length === 0) {
        throw new Error('É necessário selecionar pelo menos um workspace');
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
    const responseData = await this.helpers.requestWithAuthentication.call(this, 'powerBI', options);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getInfo = getInfo;
//# sourceMappingURL=getInfo.js.map