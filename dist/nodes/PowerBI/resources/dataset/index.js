"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasetOperations = void 0;
const list_1 = require("./list");
const get_1 = require("./get");
const refresh_1 = require("./refresh");
const getTables_1 = require("./getTables");
const addRows_1 = require("./addRows");
const executeQueries_1 = require("./executeQueries");
const getRefreshHistory_1 = require("./getRefreshHistory");
exports.datasetOperations = {
    list: list_1.list,
    get: get_1.get,
    refresh: refresh_1.refresh,
    getTables: getTables_1.getTables,
    addRows: addRows_1.addRows,
    executeQueries: executeQueries_1.executeQueries,
    getRefreshHistory: getRefreshHistory_1.getRefreshHistory,
};
//# sourceMappingURL=index.js.map