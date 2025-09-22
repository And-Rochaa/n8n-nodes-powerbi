"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
async function refreshToken(i) {
    const returnData = [];
    try {
        const tokenUrl = this.getNodeParameter('tokenUrl', i);
        const clientId = this.getNodeParameter('clientId', i);
        const clientSecret = this.getNodeParameter('clientSecret', i);
        const refreshToken = this.getNodeParameter('refreshToken', i);
        const redirectUri = this.getNodeParameter('redirectUri', i);
        const grantType = this.getNodeParameter('grantType', i, 'refresh_token');
        const scope = this.getNodeParameter('scope', i, 'https://analysis.windows.net/powerbi/api/.default offline_access');
        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('refresh_token', refreshToken);
        formData.append('redirect_uri', redirectUri);
        formData.append('grant_type', grantType);
        formData.append('scope', scope);
        const tokenData = await this.helpers.httpRequest({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(tokenData), { itemData: { item: i } });
        returnData.push(...executionData);
        return returnData;
    }
    catch (error) {
        if (error.response) {
            const errorMessage = `Request error: ${error.response.statusCode} - ${error.response.statusMessage}`;
            throw new Error(errorMessage);
        }
        throw error;
    }
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=refreshToken.js.map