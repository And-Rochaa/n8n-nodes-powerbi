/// <reference types="node" />
/// <reference types="node" />
import { IExecuteFunctions, IExecuteSingleFunctions, ILoadOptionsFunctions, IDataObject, JsonObject } from 'n8n-workflow';
export declare function powerBiApiRequestWithHeaders(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject, headers?: IDataObject, requestOptions?: IDataObject): Promise<JsonObject | Buffer | string>;
export declare function getGroups(this: IExecuteFunctions | ILoadOptionsFunctions, headers: IDataObject): Promise<IDataObject[]>;
export declare function getGroupsMultiSelect(this: IExecuteFunctions | ILoadOptionsFunctions, headers: IDataObject): Promise<IDataObject[]>;
export declare function getDashboards(this: IExecuteFunctions | ILoadOptionsFunctions, groupId: string, headers: IDataObject): Promise<IDataObject[]>;
export declare function getDatasets(this: IExecuteFunctions | ILoadOptionsFunctions, groupId: string, headers: IDataObject): Promise<IDataObject[]>;
export declare function getTables(this: IExecuteFunctions | ILoadOptionsFunctions, groupId: string, datasetId: string, headers: IDataObject): Promise<IDataObject[]>;
export declare function getReports(this: IExecuteFunctions | ILoadOptionsFunctions, groupId: string, headers: IDataObject): Promise<IDataObject[]>;
