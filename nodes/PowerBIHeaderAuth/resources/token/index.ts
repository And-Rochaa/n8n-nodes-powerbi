import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData } from 'n8n-workflow';

import { generateAuthUrl } from './generateAuthUrl';
import { getToken } from './getToken';
import { refreshToken } from './refreshToken';
import { getServicePrincipalToken } from './getServicePrincipalToken';

export const token = {
	generateAuthUrl,
	getToken,
	refreshToken,
	getServicePrincipalToken,
};
