module.exports = {
  // Exportando corretamente as credenciais e os nós
  credentials: {
    PowerBiApiOAuth2Api: require('./dist/credentials/PowerBiApiOAuth2Api.credentials').PowerBiApiOAuth2Api,
    PowerBiApi: require('./dist/credentials/PowerBiApi.credentials').PowerBiApi,
  },
  nodes: {
    PowerBi: require('./dist/nodes/PowerBI/PowerBi.node').PowerBi,
  },
};