import { getDatasource } from './getDatasource';
import { getGateway } from './get';
import { getDatasources } from './getDatasources';
import { getDatasourceStatus } from './getDatasourceStatus';
import { getDatasourceUsers } from './getDatasourceUsers';
import { list } from './list';

// We export all available operations for gateway
export const gatewayOperations = {
    get: getGateway,
    getDatasource,
    getDatasources,
    getDatasourceStatus,
    getDatasourceUsers,
    list,
};
