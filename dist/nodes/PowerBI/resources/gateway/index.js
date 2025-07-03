"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayOperations = void 0;
const getDatasource_1 = require("./getDatasource");
const get_1 = require("./get");
const getDatasources_1 = require("./getDatasources");
const getDatasourceStatus_1 = require("./getDatasourceStatus");
const getDatasourceUsers_1 = require("./getDatasourceUsers");
const list_1 = require("./list");
exports.gatewayOperations = {
    get: get_1.getGateway,
    getDatasource: getDatasource_1.getDatasource,
    getDatasources: getDatasources_1.getDatasources,
    getDatasourceStatus: getDatasourceStatus_1.getDatasourceStatus,
    getDatasourceUsers: getDatasourceUsers_1.getDatasourceUsers,
    list: list_1.list,
};
//# sourceMappingURL=index.js.map