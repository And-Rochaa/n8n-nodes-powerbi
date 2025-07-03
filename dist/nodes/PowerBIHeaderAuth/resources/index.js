"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
const admin_1 = require("./admin");
const dashboard_1 = require("./dashboard");
const dataset_1 = require("./dataset");
const dataflow_1 = require("./dataflow");
const gateway_1 = require("./gateway");
const group_1 = require("./group");
const report_1 = require("./report");
const token_1 = require("./token");
exports.resources = {
    admin: admin_1.adminOperations,
    dashboard: dashboard_1.dashboardOperations,
    dataset: dataset_1.datasetOperations,
    dataflow: dataflow_1.dataflowOperations,
    gateway: gateway_1.gatewayOperations,
    group: group_1.groupOperations,
    report: report_1.reportOperations,
    token: token_1.token,
};
//# sourceMappingURL=index.js.map