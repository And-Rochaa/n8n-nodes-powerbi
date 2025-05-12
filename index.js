module.exports = {
  // Exportando corretamente as credenciais e os nós
  credentials: {
    PowerBI: require('./dist/credentials/PowerBI.credentials').PowerBI,
  },
  nodes: {
    PowerBI: require('./dist/nodes/PowerBI/PowerBI.node').PowerBI,
    PowerBIHeaderAuth: require('./dist/nodes/PowerBIHeaderAuth/PowerBIHeaderAuth.node').PowerBIHeaderAuth,
  },
  // Exportações individuais para compatibilidade
  PowerBI: require('./dist/credentials/PowerBI.credentials').PowerBI,
  PowerBINode: require('./dist/nodes/PowerBI/PowerBI.node').PowerBI,
  PowerBIHeaderAuthNode: require('./dist/nodes/PowerBIHeaderAuth/PowerBIHeaderAuth.node').PowerBIHeaderAuth,
};