import { listDataflows } from './list';
import { get } from './get';

// We export all available operations for dataflow
export const dataflowOperations = {
    list: listDataflows,
    get,
};
