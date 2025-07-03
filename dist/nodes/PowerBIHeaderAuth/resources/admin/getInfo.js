"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
async function getInfo(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const workspaces = this.getNodeParameter('workspaces', i);
    if (!workspaces || workspaces.length === 0) {
        throw new Error('It is necessary to select at least one workspace');
    }
    const datasetSchema = this.getNodeParameter('datasetSchema', i, false);
    const datasetExpressions = this.getNodeParameter('datasetExpressions', i, false);
    const lineage = this.getNodeParameter('lineage', i, false);
    const datasourceDetails = this.getNodeParameter('datasourceDetails', i, false);
    const queryParameters = {
        datasetSchema: datasetSchema ? 'True' : 'False',
        datasetExpressions: datasetExpressions ? 'True' : 'False',
        lineage: lineage ? 'True' : 'False',
        datasourceDetails: datasourceDetails ? 'True' : 'False',
    };
    const options = {
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
    const responseData = await this.helpers.request(options);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getInfo = getInfo;
//# sourceMappingURL=getInfo.js.map