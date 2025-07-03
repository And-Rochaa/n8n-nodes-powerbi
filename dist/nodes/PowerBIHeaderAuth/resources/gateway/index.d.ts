import { getDatasource } from './getDatasource';
import { getDatasourceStatus } from './getDatasourceStatus';
import { getDatasources } from './getDatasources';
import { getDatasourceUsers } from './getDatasourceUsers';
import { getGateway } from './get';
import { listGateways } from './list';
export declare const gatewayOperations: {
    getDatasource: typeof getDatasource;
    getDatasourceStatus: typeof getDatasourceStatus;
    getDatasources: typeof getDatasources;
    getDatasourceUsers: typeof getDatasourceUsers;
    get: typeof getGateway;
    list: typeof listGateways;
};
