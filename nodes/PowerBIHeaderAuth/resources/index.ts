import { adminOperations } from './admin';
import { dashboardOperations } from './dashboard';
import { datasetOperations } from './dataset';
import { dataflowOperations } from './dataflow';
import { gatewayOperations } from './gateway';
import { groupOperations } from './group';
import { reportOperations } from './report';
import { token } from './token';

// We export an object with all resources
export const resources = {
    admin: adminOperations,
    dashboard: dashboardOperations,
    dataset: datasetOperations,
    dataflow: dataflowOperations,
    gateway: gatewayOperations,
    group: groupOperations,
    report: reportOperations,
    token: token,
};
