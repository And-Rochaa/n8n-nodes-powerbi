export declare const resources: {
    admin: {
        getInfo: typeof import("./admin/getInfo").getInfo;
        getScanResult: typeof import("./admin/getScanResult").getScanResult;
    };
    dashboard: {
        get: typeof import("./dashboard/get").get;
        list: typeof import("./dashboard/list").list;
        getTiles: typeof import("./dashboard/getTiles").getTiles;
    };
    dataset: {
        list: typeof import("./dataset/list").list;
        get: typeof import("./dataset/get").get;
        refresh: typeof import("./dataset/refresh").refresh;
        getTables: typeof import("./dataset/getTables").getTables;
        addRows: typeof import("./dataset/addRows").addRows;
        executeQueries: typeof import("./dataset/executeQueries").executeQueries;
        getRefreshHistory: typeof import("./dataset/getRefreshHistory").getRefreshHistory;
    };
    dataflow: {
        list: typeof import("./dataflow/list").list;
        get: typeof import("./dataflow/get").get;
    };
    gateway: {
        getDatasource: typeof import("./gateway/getDatasource").getDatasource;
        getDatasourceStatus: typeof import("./gateway/getDatasourceStatus").getDatasourceStatus;
        getDatasources: typeof import("./gateway/getDatasources").getDatasources;
        getDatasourceUsers: typeof import("./gateway/getDatasourceUsers").getDatasourceUsers;
        get: typeof import("./gateway/get").getGateway;
        list: typeof import("./gateway/list").listGateways;
    };
    group: {
        get: typeof import("./group/get").get;
        list: typeof import("./group/list").list;
        getReports: typeof import("./group/getReports").getReports;
        getDashboards: typeof import("./group/getDashboards").getDashboards;
        getDatasets: typeof import("./group/getDatasets").getDatasets;
    };
    report: {
        get: typeof import("./report/get").get;
        list: typeof import("./report/list").list;
        getPages: typeof import("./report/getPages").getPages;
        exportToFile: typeof import("./report/exportToFile").exportToFile;
    };
    token: {
        generateAuthUrl: typeof import("./token/generateAuthUrl").generateAuthUrl;
        getToken: typeof import("./token/getToken").getToken;
        refreshToken: typeof import("./token/refreshToken").refreshToken;
        getServicePrincipalToken: typeof import("./token/getServicePrincipalToken").getServicePrincipalToken;
    };
};
