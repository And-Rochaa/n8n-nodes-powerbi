"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
const admin_1 = require("./admin");
const dashboard_1 = require("./dashboard");
const dataflow_1 = require("./dataflow");
const dataset_1 = require("./dataset");
const gateway_1 = require("./gateway");
const group_1 = require("./group");
const report_1 = require("./report");
const token_1 = require("./token");
exports.resources = {
    admin: admin_1.adminOperations,
    dashboard: dashboard_1.dashboardOperations,
    dataflow: dataflow_1.dataflowOperations,
    dataset: dataset_1.datasetOperations,
    gateway: gateway_1.gatewayOperations,
    group: group_1.groupOperations,
    report: report_1.reportOperations,
    token: token_1.token,
};
//# sourceMappingURL=index.js.map