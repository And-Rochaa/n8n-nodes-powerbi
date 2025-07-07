import { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class PowerBiApiOAuth2Api implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    extends: string[];
    icon: string;
    properties: INodeProperties[];
    test: ICredentialTestRequest;
}
