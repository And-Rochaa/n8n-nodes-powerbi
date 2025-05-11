import { list } from './list';
import { get } from './get';
import { refresh } from './refresh';
import { getTables } from './getTables';
import { addRows } from './addRows';
import { executeQueries } from './executeQueries';
import { getRefreshHistory } from './getRefreshHistory';
export declare const datasetOperations: {
    list: typeof list;
    get: typeof get;
    refresh: typeof refresh;
    getTables: typeof getTables;
    addRows: typeof addRows;
    executeQueries: typeof executeQueries;
    getRefreshHistory: typeof getRefreshHistory;
};
