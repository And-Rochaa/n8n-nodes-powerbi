import { listDataflows } from './list';
import { get } from './get';
import { getDatasources } from './getDatasources';
import { getTransactions } from './getTransactions';
import { refresh } from './refresh';
export declare const dataflowOperations: {
    list: typeof listDataflows;
    get: typeof get;
    getDatasources: typeof getDatasources;
    getTransactions: typeof getTransactions;
    refresh: typeof refresh;
};
