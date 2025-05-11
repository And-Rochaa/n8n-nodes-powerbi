module.exports = {
  PowerBIApi: require('./dist/credentials/PowerBIApi.credentials').PowerBIApi,
  PowerBI: require('./dist/nodes/PowerBI/PowerBI.node').PowerBI,
  PowerBIHeaderAuth: require('./dist/nodes/PowerBIHeaderAuth/PowerBIHeaderAuth.node').PowerBIHeaderAuth,
};