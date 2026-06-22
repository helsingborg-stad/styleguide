/** @jest-environment node */

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsBuiltOutputConsoleIgnoreList, type JsConsoleIgnoreRule } from './jsBuiltOutputConsoleIgnoreList';

interface ValidatorManifest {
	[entryName: string]: ValidatorManifestEntry;
}

interface ViteManifestEntry {
	file?: string;
}

type ValidatorManifestEntry = string | ViteManifestEntry;

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

function isJsBundlePath(assetPath: string): boolean {
	return assetPath.endsWith('.js') && !assetPath.endsWith('.js.map');
}

function resolveDistAssetPath(assetPath: string): string {
	return path.join(distPath, assetPath.replace(/^\/+/, ''));
}

function getManifestEntryAssetPath(entry: ValidatorManifestEntry): string | null {
	if (typeof entry === 'string') {
		return entry;
	}

	return entry.file ?? null;
}

async function getFallbackBuiltJsBundles(directoryPath = distJsPath): Promise<string[]> {
	if (!existsSync(directoryPath)) {
		return [];
	}

	const entries = await readdir(directoryPath, { withFileTypes: true });
	const bundles: string[] = [];

	for (const entry of entries) {
		const entryPath = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			bundles.push(...(await getFallbackBuiltJsBundles(entryPath)));
			continue;
		}

		if (entry.isFile() && isJsBundlePath(entry.name)) {
			bundles.push(entryPath);
		}
	}

	return bundles;
}

async function getBuiltJsBundles(): Promise<string[]> {
	if (!existsSync(manifestPath)) {
		return getFallbackBuiltJsBundles();
	}

	const manifestRaw = await readFile(manifestPath, 'utf8');
	const manifest = JSON.parse(manifestRaw) as ValidatorManifest;
	const manifestBundles = Object.values(manifest)
		.map(getManifestEntryAssetPath)
		.filter((assetPath): assetPath is string => assetPath !== null && isJsBundlePath(assetPath))
		.map(resolveDistAssetPath);

	return manifestBundles.length > 0 ? manifestBundles : getFallbackBuiltJsBundles();
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