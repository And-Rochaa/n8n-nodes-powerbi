import { adminOperations } from './admin';
import { dashboardOperations } from './dashboard';
import { datasetOperations } from './dataset';
import { groupOperations } from './group';
import { reportOperations } from './report';

// Exportamos um objeto com todos os recursos
export const resources = {
    admin: adminOperations,
    dashboard: dashboardOperations,
    dataset: datasetOperations,
    group: groupOperations,
    report: reportOperations,
};
