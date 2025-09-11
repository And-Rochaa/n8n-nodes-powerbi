"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthUrl = void 0;
async function generateAuthUrl(i) {
    const returnData = [];
    const baseUrl = this.getNodeParameter('url', i);
    const clientId = this.getNodeParameter('clientId', i);
    const responseType = this.getNodeParameter('responseType', i);
    const redirectUri = this.getNodeParameter('redirectUri', i);
    const responseMode = this.getNodeParameter('responseMode', i);
    const scope = this.getNodeParameter('scope', i);
    const state = this.getNodeParameter('state', i, '');
    let authUrl = `${baseUrl}?client_id=${encodeURIComponent(clientId)}&response_type=${encodeURIComponent(responseType)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=${encodeURIComponent(responseMode)}&scope=${encodeURIComponent(scope)}`;
    if (state) {
        authUrl += `&state=${encodeURIComponent(state)}`;
    }
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
        authUrl,
        baseUrl,
        clientId,
        responseType,
        redirectUri,
        responseMode,
        scope,
        state,
    }), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.generateAuthUrl = generateAuthUrl;
//# sourceMappingURL=generateAuthUrl.js.map