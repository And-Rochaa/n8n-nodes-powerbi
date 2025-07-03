"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayOperations = void 0;
const getDatasource_1 = require("./getDatasource");
const getDatasourceStatus_1 = require("./getDatasourceStatus");
const getDatasources_1 = require("./getDatasources");
const getDatasourceUsers_1 = require("./getDatasourceUsers");
const get_1 = require("./get");
const list_1 = require("./list");
exports.gatewayOperations = {
    getDatasource: getDatasource_1.getDatasource,
    getDatasourceStatus: getDatasourceStatus_1.getDatasourceStatus,
    getDatasources: getDatasources_1.getDatasources,
    getDatasourceUsers: getDatasourceUsers_1.getDatasourceUsers,
    get: get_1.getGateway,
    list: list_1.listGateways,
};
//# sourceMappingURL=index.js.map