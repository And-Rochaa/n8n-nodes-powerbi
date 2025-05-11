import { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class PowerBIApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    extends: string[];
    icon: string;
    properties: INodeProperties[];
    test: ICredentialTestRequest;
}
