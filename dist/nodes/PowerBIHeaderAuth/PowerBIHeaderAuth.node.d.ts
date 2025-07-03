import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class PowerBIHeaderAuth implements INodeType {
    description: INodeTypeDescription;
    constructor();
    methods: {
        loadOptions: {
            getGroups(this: ILoadOptionsFunctions): Promise<any>;
            getGroupsMultiSelect(this: ILoadOptionsFunctions): Promise<any>;
            getDashboards(this: ILoadOptionsFunctions): Promise<any>;
            getDatasets(this: ILoadOptionsFunctions): Promise<any>;
            getTables(this: ILoadOptionsFunctions): Promise<any>;
            getReports(this: ILoadOptionsFunctions): Promise<any>;
            getDataflows(this: ILoadOptionsFunctions): Promise<any>;
            getGateways(this: ILoadOptionsFunctions): Promise<any>;
            getDatasources(this: ILoadOptionsFunctions): Promise<any>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
