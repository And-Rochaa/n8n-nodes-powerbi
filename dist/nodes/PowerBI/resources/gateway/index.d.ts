import { getDatasource } from './getDatasource';
import { getGateway } from './get';
import { getDatasources } from './getDatasources';
import { getDatasourceStatus } from './getDatasourceStatus';
import { getDatasourceUsers } from './getDatasourceUsers';
import { list } from './list';
export declare const gatewayOperations: {
    get: typeof getGateway;
    getDatasource: typeof getDatasource;
    getDatasources: typeof getDatasources;
    getDatasourceStatus: typeof getDatasourceStatus;
    getDatasourceUsers: typeof getDatasourceUsers;
    list: typeof list;
};
