import { getDatasource } from './getDatasource';
import { getDatasourceStatus } from './getDatasourceStatus';
import { getDatasources } from './getDatasources';
import { getDatasourceUsers } from './getDatasourceUsers';
import { getGateway } from './get';
import { listGateways } from './list';

export const gatewayOperations = {
    getDatasource,
    getDatasourceStatus,
    getDatasources,
    getDatasourceUsers,
    get: getGateway,
    list: listGateways,
};
