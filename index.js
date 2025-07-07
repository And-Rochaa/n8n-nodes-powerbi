module.exports = {
  // Exportando corretamente as credenciais e os nós
  credentials: {
    PowerBiApiOAuth2Api: require('./dist/credentials/PowerBiApiOAuth2Api.credentials').PowerBiApiOAuth2Api,
  },
  nodes: {
    PowerBi: require('./dist/nodes/PowerBI/PowerBi.node').PowerBi,
    PowerBiHeaderAuth: require('./dist/nodes/PowerBIHeaderAuth/PowerBiHeaderAuth.node').PowerBiHeaderAuth,
  },
};