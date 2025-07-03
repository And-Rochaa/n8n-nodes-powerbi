import { listDataflows } from './list';
import { get } from './get';

// Exportamos todas as operações disponíveis para dataflow
export const dataflowOperations = {
    list: listDataflows,
    get,
};
