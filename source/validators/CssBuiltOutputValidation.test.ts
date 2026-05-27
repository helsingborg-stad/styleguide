/** @jest-environment node */

import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { type CssValidatorIgnoreRule, cssValidatorIgnoreList } from './cssValidatorIgnoreList';

interface ValidatorManifest {
	[entryName: string]: string;
}

interface ValidatorIssue {
	context?: string;
	line?: number;
	message?: string;
	type?: string;
}

interface ValidatorResponse {
	cssvalidation?: {
		errors?: ValidatorIssue[];
		result?: {
			errorcount?: number;
			warningcount?: number;
		};
		warnings?: ValidatorIssue[];
	};
}

interface BundleValidationResult {
	bundle: string;
	issues: Array<ValidatorIssue & { severity: 'error' | 'warning' }>;
	ignoredIssues: Array<ValidatorIssue & { severity: 'error' | 'warning' }>;
	responseSummary: {
		errorcount?: number;
		warningcount?: number;
	};
}

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(__dirname, '..', '..');
const manifestPath = path.join(projectRoot, 'assets', 'dist', 'manifest.json');
const validatorUrl = 'https://jigsaw.w3.org/css-validator/validator?output=json';
const validatorTestEnabled = process.env.RUN_W3C_CSS_VALIDATION === 'true';
const includeValidatorWarnings = process.env.RUN_W3C_CSS_VALIDATION_WARNINGS === 'true';
const cssValidationIt = validatorTestEnabled ? it : it.skip;

/**
 * Returns built CSS bundles listed in the Vite manifest.
 */
async function getBuiltCssBundles(): Promise<string[]> {
	const manifestRaw = await readFile(manifestPath, 'utf8');
	const manifest = JSON.parse(manifestRaw) as ValidatorManifest;

	return Object.entries(manifest)
		.filter(([entryName, assetPath]) => entryName.startsWith('css/') && assetPath.endsWith('.css'))
		.map(([, assetPath]) => path.join(projectRoot, 'assets', 'dist', assetPath));
}

/**
 * Posts CSS to the W3C validator using multipart form input.
 * The validator's x-www-form-urlencoded text endpoint is currently unstable.
 */
async function validateCssBundle(bundlePath: string): Promise<BundleValidationResult> {
	const cssSource = await readFile(bundlePath, 'utf8');
	const tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'styleguide-css-validator-'));
	const tempCssPath = path.join(tempDirectory, path.basename(bundlePath));
	await writeFile(tempCssPath, cssSource, 'utf8');

	let stdout = '';
	let stderr = '';

	try {
		const result = await execFileAsync('curl', ['-sS', '-X', 'POST', '-F', `text=<${tempCssPath}`, '-F', 'output=json', validatorUrl.replace('?output=json', '')], {
			maxBuffer: 20 * 1024 * 1024,
		});

		stdout = result.stdout;
		stderr = result.stderr;
	} finally {
		await rm(tempDirectory, { force: true, recursive: true });
	}

	if (stderr.trim().length > 0) {
		throw new Error(`CSS validator request failed for ${path.basename(bundlePath)}: ${stderr.trim()}`);
	}

	let parsed: ValidatorResponse;

	try {
		parsed = JSON.parse(stdout) as ValidatorResponse;
	} catch {
		const responsePreview = stdout.slice(0, 500).trim();
		throw new Error([`CSS validator returned a non-JSON response for ${path.basename(bundlePath)}.`, 'Response preview:', responsePreview.length > 0 ? responsePreview : '[empty response]'].join('\n'));
	}

	const errors = (parsed.cssvalidation?.errors ?? []).map((issue) => ({ ...issue, severity: 'error' as const }));
	const warnings = (parsed.cssvalidation?.warnings ?? []).map((issue) => ({ ...issue, severity: 'warning' as const }));
	const issues = includeValidatorWarnings ? [...errors, ...warnings] : errors;
	const ignoredWarnings = includeValidatorWarnings ? [] : warnings;
	const ignoredIssues = issues.filter((issue) => shouldIgnoreIssue(issue, bundlePath, cssValidatorIgnoreList));
	const remainingIssues = issues.filter((issue) => !shouldIgnoreIssue(issue, bundlePath, cssValidatorIgnoreList));

	return {
		bundle: bundlePath,
		ignoredIssues: [...ignoredWarnings, ...ignoredIssues],
		issues: remainingIssues,
		responseSummary: {
			errorcount: parsed.cssvalidation?.result?.errorcount,
			warningcount: parsed.cssvalidation?.result?.warningcount,
		},
	};
}

/**
 * Checks whether a validator issue matches one of the configured ignore rules.
 */
function shouldIgnoreIssue(issue: ValidatorIssue & { severity: 'error' | 'warning' }, bundlePath: string, ignoreRules: CssValidatorIgnoreRule[]): boolean {
	const normalizedMessage = issue.message ? normalizeValidatorText(issue.message) : undefined;
	const normalizedContext = issue.context ? normalizeValidatorText(issue.context) : undefined;

	return ignoreRules.some((rule) => {
		const normalizedRuleMessage = normalizeValidatorText(rule.messageIncludes);
		const normalizedRuleContext = rule.contextIncludes ? normalizeValidatorText(rule.contextIncludes) : undefined;

		if (rule.type && rule.type !== issue.severity) {
			return false;
		}

		if (rule.bundle && !bundlePath.includes(rule.bundle)) {
			return false;
		}

		if (!normalizedMessage?.includes(normalizedRuleMessage)) {
			return false;
		}

		if (normalizedRuleContext && !normalizedContext?.includes(normalizedRuleContext)) {
			return false;
		}

		return true;
	});
}

/**
 * Normalizes typographic punctuation so ignore matching can stay ASCII.
 */
function normalizeValidatorText(value: string): string {
	return value
		?.replace(/[\u2018\u2019]/g, "'")
		?.replace(/[\u201C\u201D]/g, '"')
		?.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Formats the validator result into a failure message with ignored issues included for visibility.
 */
function formatFailureMessage(results: BundleValidationResult[]): string {
	return results
		.map((result) => {
			const relativeBundlePath = path.relative(projectRoot, result.bundle);
			const activeIssues = result.issues
				.map((issue) => {
					const lineSuffix = issue.line ? ` line ${issue.line}` : '';
					const contextSuffix = issue.context ? `\n  Context: ${issue.context}` : '';
					return `- [${issue.severity}]${lineSuffix} ${issue.message ?? 'Unknown issue'}${contextSuffix}`;
				})
				.join('\n');
			const ignoredIssues = result.ignoredIssues.map((issue) => `- [${issue.severity}] ${issue.message ?? 'Unknown issue'}`).join('\n');

			return [
				`${relativeBundlePath}`,
				`Reported errors: ${result.responseSummary.errorcount ?? 0}, warnings: ${result.responseSummary.warningcount ?? 0}`,
				result.ignoredIssues.length > 0 ? `Ignored issues:\n${ignoredIssues}` : 'Ignored issues: none',
				result.issues.length > 0 ? `Remaining issues:\n${activeIssues}` : 'Remaining issues: none',
			].join('\n');
		})
		.join('\n\n');
}

describe('CssBuiltOutputValidation', () => {
	cssValidationIt(
		'validates built CSS bundles against the W3C validator',
		async () => {
			const bundles = await getBuiltCssBundles();

			expect(bundles.length).toBeGreaterThan(0);

			const results = await Promise.all(bundles.map((bundlePath) => validateCssBundle(bundlePath)));
			const resultsWithIssues = results.filter((result) => result.issues.length > 0);

			if (resultsWithIssues.length > 0) {
				throw new Error(formatFailureMessage(results));
			}
		},
		120000,
	);
});
