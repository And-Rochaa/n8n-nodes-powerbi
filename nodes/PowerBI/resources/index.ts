import { adminOperations } from './admin';
import { dashboardOperations } from './dashboard';
import { dataflowOperations } from './dataflow';
import { datasetOperations } from './dataset';
import { gatewayOperations } from './gateway';
import { groupOperations } from './group';
import { reportOperations } from './report';

// Exportamos um objeto com todos os recursos
export const resources = {
    admin: adminOperations,
    dashboard: dashboardOperations,
    dataflow: dataflowOperations,
    dataset: datasetOperations,
    gateway: gatewayOperations,
    group: groupOperations,
    report: reportOperations,
};
