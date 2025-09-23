import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
interface IExtendedNodeTypeDescription extends INodeTypeDescription {
    usableAsTool?: boolean;
    codex?: {
        categories: string[];
        subcategories: Record<string, string[]>;
        alias: string[];
    };
    triggerPanel?: Record<string, any>;
}
export declare class PowerBi implements INodeType {
    description: IExtendedNodeTypeDescription;
    methods: {
        loadOptions: {
            getGroups(this: ILoadOptionsFunctions): Promise<any>;
            getGroupsMultiSelect(this: ILoadOptionsFunctions): Promise<any>;
            getDashboards(this: ILoadOptionsFunctions): Promise<any>;
            getDatasets(this: ILoadOptionsFunctions): Promise<any>;
            getDataflows(this: ILoadOptionsFunctions): Promise<any>;
            getDatasources(this: ILoadOptionsFunctions): Promise<any>;
            getGateways(this: ILoadOptionsFunctions): Promise<any>;
            getTables(this: ILoadOptionsFunctions): Promise<any>;
            getReports(this: ILoadOptionsFunctions): Promise<any>;
        };
    };
    constructor();
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
export default PowerBi;
