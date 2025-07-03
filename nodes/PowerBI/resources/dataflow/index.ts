import { listDataflows } from './list';
import { get } from './get';
import { getDatasources } from './getDatasources';
import { getTransactions } from './getTransactions';
import { refresh } from './refresh';

// We export all available operations for dataflow
export const dataflowOperations = {
    list: listDataflows,
    get,
    getDatasources,
    getTransactions,
    refresh,
};
