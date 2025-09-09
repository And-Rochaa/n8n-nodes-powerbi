/// <reference types="node" />
/// <reference types="node" />
import { IExecuteFunctions, IExecuteSingleFunctions, ILoadOptionsFunctions, IDataObject, JsonObject, INodePropertyOptions } from 'n8n-workflow';
export declare function powerBiApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject, requestOptions?: IDataObject): Promise<JsonObject | Buffer | string>;
export declare function powerBiApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: string, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any>;
export declare function getGroups(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getGroupsMultiSelect(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getDatasets(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getTables(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getReports(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getDashboards(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getGateways(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getDatasources(this: ILoadOptionsFunctions): Promise<IDataObject[]>;
export declare function getDataflows(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
