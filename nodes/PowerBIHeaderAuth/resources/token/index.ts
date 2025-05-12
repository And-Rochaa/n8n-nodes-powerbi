import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData } from 'n8n-workflow';

import { generateAuthUrl } from './generateAuthUrl';
import { getToken } from './getToken';
import { refreshToken } from './refreshToken';

export const token = {
	generateAuthUrl,
	getToken,
	refreshToken,
};
