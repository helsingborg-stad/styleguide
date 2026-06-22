/** @jest-environment node */

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsBuiltOutputConsoleIgnoreList, type JsConsoleIgnoreRule } from './jsBuiltOutputConsoleIgnoreList';

interface ValidatorManifest {
	[entryName: string]: string;
}

interface ConsoleIssue {
	bundle: string;
	line: number;
	method: 'log' | 'info' | 'debug' | 'warn' | 'error';
	content: string;
}

const projectRoot = path.resolve(__dirname, '..', '..');
const manifestPath = path.join(projectRoot, 'assets', 'dist', 'manifest.json');
const distPath = path.join(projectRoot, 'assets', 'dist');
const distJsPath = path.join(distPath, 'js');
const consolePattern = /console\.(log|info|debug|warn|error)\s*\(/;

async function getFallbackNonCacheBustedBundles(): Promise<string[]> {
	if (!existsSync(distJsPath)) {
		return [];
	}

	const entries = await readdir(distJsPath, { withFileTypes: true });
	const bundles: string[] = [];

	for (const entry of entries) {
		if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.js.map')) {
			bundles.push(path.join(distJsPath, entry.name));
		}
	}

	return bundles;
}

async function getBuiltJsBundles(): Promise<string[]> {
	if (!existsSync(manifestPath)) {
		return getFallbackNonCacheBustedBundles();
	}

	const manifestRaw = await readFile(manifestPath, 'utf8');
	const manifest = JSON.parse(manifestRaw) as ValidatorManifest;

	return Object.entries(manifest)
		.filter(([entryName, assetPath]) => entryName.startsWith('js/') && assetPath.endsWith('.js'))
		.map(([, assetPath]) => path.join(projectRoot, 'assets', 'dist', assetPath));
}

async function findConsoleIssues(bundlePath: string): Promise<ConsoleIssue[]> {
	const source = await readFile(bundlePath, 'utf8');
	const lines = source.split('\n');

	return lines.flatMap((lineContent, index) => {
		const match = lineContent.match(consolePattern);
		if (!match) {
			return [];
		}

		return [
			{
				bundle: bundlePath,
				line: index + 1,
				method: match[1] as ConsoleIssue['method'],
				content: lineContent.trim(),
			},
		];
	});
}

function shouldIgnoreIssue(issue: ConsoleIssue, ignoreRules: JsConsoleIgnoreRule[]): boolean {
	const relativeBundlePath = path.relative(path.join(projectRoot, 'assets', 'dist'), issue.bundle).replace(/\\/g, '/');

	return ignoreRules.some((rule) => {
		if (rule.bundle && rule.bundle !== relativeBundlePath) {
			return false;
		}

		if (rule.method && rule.method !== issue.method) {
			return false;
		}

		return issue.content.includes(rule.lineIncludes);
	});
}

function formatFailureMessage(issues: ConsoleIssue[]): string {
	return issues
		.map((issue) => {
			const relativeBundlePath = path.relative(projectRoot, issue.bundle).replace(/\\/g, '/');
			return `${relativeBundlePath}:${issue.line} contains console.${issue.method}\n  ${issue.content}`;
		})
		.join('\n\n');
}

describe('JsBuiltOutputConsoleValidation', () => {
	it('does not ship unexpected console statements in built JS bundles', async () => {
		const bundles = await getBuiltJsBundles();

		expect(bundles.length).toBeGreaterThan(0);

		const issues = (await Promise.all(bundles.map((bundlePath) => findConsoleIssues(bundlePath))))
			.flat()
			.filter((issue) => !shouldIgnoreIssue(issue, jsBuiltOutputConsoleIgnoreList));

		if (issues.length > 0) {
			throw new Error(formatFailureMessage(issues));
		}
	});
});