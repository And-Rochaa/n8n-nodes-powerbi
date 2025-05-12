"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
async function getToken(i) {
    var _a, _b;
    const returnData = [];
    const tokenUrl = this.getNodeParameter('tokenUrl', i);
    const clientId = this.getNodeParameter('clientId', i);
    const clientSecret = this.getNodeParameter('clientSecret', i);
    const code = this.getNodeParameter('code', i);
    const redirectUri = this.getNodeParameter('redirectUri', i);
    const grantType = this.getNodeParameter('grantType', i);
    const scope = this.getNodeParameter('scope', i);
    try {
        const options = {
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: grantType,
                scope,
            },
            json: true,
        };
        const response = await this.helpers.request(options);
        if (!response.access_token) {
            throw new Error('A resposta não contém um token de acesso válido');
        }
        const responseData = {
            access_token: response.access_token,
            token_type: response.token_type || 'Bearer',
            expires_in: response.expires_in,
            refresh_token: response.refresh_token,
            scope: response.scope,
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
                'Erro na obtenção do token';
            throw new Error(`Erro na requisição do token: ${errorMessage}`);
        }
        throw new Error(`Falha ao obter token: ${error.message}`);
    }
}
exports.getToken = getToken;
//# sourceMappingURL=getToken.js.map