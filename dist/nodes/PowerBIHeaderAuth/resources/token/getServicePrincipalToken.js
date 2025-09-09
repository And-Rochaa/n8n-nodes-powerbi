"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicePrincipalToken = void 0;
async function getServicePrincipalToken(i) {
    var _a, _b;
    const returnData = [];
    const tenantId = this.getNodeParameter('tenantId', i);
    const clientId = this.getNodeParameter('clientId', i);
    const clientSecret = this.getNodeParameter('clientSecret', i);
    const resource = this.getNodeParameter('apiResource', i, 'https://analysis.windows.net/powerbi/api');
    const grantType = this.getNodeParameter('grantType', i, 'client_credentials');
    try {
        const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
        const formData = new URLSearchParams({
            grant_type: grantType,
            client_id: clientId,
            client_secret: clientSecret,
            resource: resource,
        });
        const options = {
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            json: true,
        };
        const response = await this.helpers.httpRequest(options);
        if (!response.access_token) {
            throw new Error('Response does not contain a valid access token');
        }
        const responseData = {
            access_token: response.access_token,
            token_type: response.token_type || 'Bearer',
            expires_in: response.expires_in,
            expires_on: response.expires_on,
            resource: response.resource,
            ext_expires_in: response.ext_expires_in,
        };
        returnData.push({
            json: responseData,
        });
        return returnData;
    }
    catch (error) {
        if (error.response) {
            const errorMessage = ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.error_description) ||
                ((_b = error.response.data) === null || _b === void 0 ? void 0 : _b.error) ||
                'Token acquisition error';
            throw new Error(`Token request error: ${errorMessage}`);
        }
        throw new Error(`Failed to get Service Principal token: ${error.message}`);
    }
}
exports.getServicePrincipalToken = getServicePrincipalToken;
//# sourceMappingURL=getServicePrincipalToken.js.map