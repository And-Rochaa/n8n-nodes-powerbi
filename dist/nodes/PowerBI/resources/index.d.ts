export declare const resources: {
    admin: {
        getInfo: typeof import("./admin/getInfo").getInfo;
        getScanResult: typeof import("./admin/getScanResult").getScanResult;
    };
    dashboard: {
        list: typeof import("./dashboard/list").list;
        get: typeof import("./dashboard/get").get;
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
    group: {
        list: typeof import("./group/list").list;
        get: typeof import("./group/get").get;
        getReports: typeof import("./group/getReports").getReports;
        getDashboards: typeof import("./group/getDashboards").getDashboards;
        getDatasets: typeof import("./group/getDatasets").getDatasets;
    };
    report: {
        list: typeof import("./report/list").list;
        get: typeof import("./report/get").get;
        getPages: typeof import("./report/getPages").getPages;
        exportToFile: typeof import("./report/exportToFile").exportToFile;
    };
};
