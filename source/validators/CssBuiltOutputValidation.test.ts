/** @jest-environment node */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface ValidatorIssue {
	column?: number;
	line?: number;
	message?: string;
	details?: string;
	property?: string;
}

const { validate } = require('csstree-validator') as { validate: (css: string, filename: string) => ValidatorIssue[] };

const projectRoot = path.resolve(__dirname, '..', '..');
const distDirectory = path.join(projectRoot, 'assets', 'dist');
const cssValidationIt = process.env.RUN_CSS_VALIDATION === 'true' ? it : it.skip;

describe('CssBuiltOutputValidation', () => {
	cssValidationIt('validates built CSS bundles with CSSTree', async () => {
		const manifest = JSON.parse(await readFile(path.join(distDirectory, 'manifest.json'), 'utf8')) as Record<string, string>;
		const bundles = Object.entries(manifest)
			.filter(([entryName, assetPath]) => entryName.startsWith('css/') && assetPath.endsWith('.css'));
		expect(bundles.length).toBeGreaterThan(0);

		const results = await Promise.all(bundles.map(async ([name, assetPath]) => {
			const bundlePath = path.join(distDirectory, assetPath);
			return { name, errors: validate(await readFile(bundlePath, 'utf8'), bundlePath) };
		}));
		const errors = results.flatMap(({ name, errors }) => errors.map((issue) => ({ name, issue })));

		if (errors.length > 0) {
			const details = errors.map(({ name, issue }) => [
				`- ${name}${issue.line ? ` (line ${issue.line}${issue.column ? `, column ${issue.column}` : ''})` : ''}: ${issue.message ?? 'Unknown error'}`,
				issue.property ? `  Property: ${issue.property}` : '',
				issue.details ? `  Details: ${issue.details}` : '',
			].filter(Boolean).join('\n')).join('\n');
			throw new Error(`CSSTree reported ${errors.length} CSS error(s).\n${details}`);
		}
	}, 300000);
});
