import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	...tseslint.configs.recommended,
	n8nCommunityNodesPlugin.configs.recommended,
	{
		rules: {
			'@n8n/community-nodes/node-usable-as-tool': 'warn',
			// Desabilitar regras de type-check do typescript-eslint que não precisamos
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
);
