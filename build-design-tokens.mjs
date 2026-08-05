/**
 * Design Tokens Compiler
 *
 * Reads source/data/design-tokens.json and generates
 * source/sass/setting/_design-tokens.scss
 *
 * Also processes component tokens from source/components/{name}/component.json
 *
 * Usage:
 *   node build-design-tokens.mjs
 */

import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INPUT = resolve(__dirname, 'source/data/design-tokens.json');
const OUTPUT = resolve(__dirname, 'source/sass/setting/_design-tokens.scss');
const COMPONENT_DIR = resolve(__dirname, 'source/components');
const COMPONENT_OUTPUT = resolve(__dirname, 'component-design-tokens.json');
const OBJECT_DIR = resolve(__dirname, 'source/objects');

function isRecord(value) {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function writeFileAtomic(path, content) {
	const tempPath = `${path}.tmp`;
	writeFileSync(tempPath, content, 'utf-8');
	renameSync(tempPath, path);
}

function validateTokenData(data) {
	if (!data || !Array.isArray(data.categories)) {
		throw new Error('Invalid token source: "categories" must be an array.');
	}

	for (const category of data.categories) {
		if (!Array.isArray(category.settings)) {
			throw new Error(`Invalid token source: category "${category?.id || 'unknown'}" is missing a valid "settings" array.`);
		}
	}
}

function validateComponentTokenReferences(componentName, componentData) {
	const declaredTokens = Array.isArray(componentData?.tokens) ? componentData.tokens : [];
	const declaredTokensSet = new Set(declaredTokens);
	const componentSettings = Array.isArray(componentData?.componentSettings) ? componentData.componentSettings : [];
	const invalidReferences = [];

	for (const category of componentSettings) {
		const settings = Array.isArray(category?.settings) ? category.settings : [];

		for (const setting of settings) {
			if (typeof setting?.token !== 'string') {
				continue;
			}

			if (!declaredTokensSet.has(setting.token)) {
				invalidReferences.push({
					categoryId: category?.id || 'unknown',
					token: setting.token,
				});
			}
		}
	}

	if (invalidReferences.length > 0) {
		const details = invalidReferences.map(({ categoryId, token }) => `- category "${categoryId}" references token "${token}" that is missing from tokens[]`).join('\n');

		throw new Error(`Invalid component token references in source/components/${componentName}/component.json:\n${details}`);
	}
}

function loadObjectDefinitions(objectsDir) {
	if (!existsSync(objectsDir)) {
		return {};
	}

	const definitions = {};
	const objectDirs = readdirSync(objectsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const objectName of objectDirs) {
		const objectFile = join(objectsDir, objectName, 'object.json');
		if (!existsSync(objectFile)) {
			continue;
		}

		const objectData = JSON.parse(readFileSync(objectFile, 'utf-8'));
		if (!isRecord(objectData)) {
			continue;
		}

		definitions[objectName] = objectData;
	}

	return definitions;
}

function resolveComponentSettingOptionsFromObjects(componentName, componentData, objectDefinitions) {
	const componentSettings = Array.isArray(componentData?.componentSettings) ? componentData.componentSettings : [];

	for (const category of componentSettings) {
		const settings = Array.isArray(category?.settings) ? category.settings : [];

		for (const setting of settings) {
			if (!isRecord(setting) || setting.type !== 'select' || (Array.isArray(setting.options) && setting.options.length > 0)) {
				continue;
			}

			const optionsFromObject = isRecord(setting.optionsFromObject) ? setting.optionsFromObject : null;
			if (!optionsFromObject) {
				continue;
			}

			const objectSlug = typeof optionsFromObject.object === 'string' ? optionsFromObject.object : '';
			const settingSlug = typeof optionsFromObject.setting === 'string' ? optionsFromObject.setting : '';

			if (!objectSlug || !settingSlug) {
				throw new Error(`Invalid optionsFromObject reference in source/components/${componentName}/component.json. Expected both "object" and "setting" as non-empty strings.`);
			}

			const referencedObject = objectDefinitions[objectSlug];
			if (!isRecord(referencedObject)) {
				throw new Error(`Unable to resolve optionsFromObject.object "${objectSlug}" for source/components/${componentName}/component.json. Ensure source/objects/${objectSlug}/object.json exists.`);
			}

			const objectSettings = isRecord(referencedObject.settings) ? referencedObject.settings : null;
			const referencedSetting = objectSettings && isRecord(objectSettings[settingSlug]) ? objectSettings[settingSlug] : null;
			const referencedOptions = referencedSetting && Array.isArray(referencedSetting.options) ? referencedSetting.options : null;

			if (!referencedOptions || referencedOptions.length === 0) {
				throw new Error(`Unable to resolve optionsFromObject.setting "${settingSlug}" for source/components/${componentName}/component.json. Ensure source/objects/${objectSlug}/object.json defines settings.${settingSlug}.options.`);
			}

			const normalizedOptions = referencedOptions
				.filter(isRecord)
				.map((option) => {
					const value = typeof option.value === 'string' ? option.value : null;
					const label = typeof option.label === 'string' ? option.label : null;
					return value !== null && label ? { value, label } : null;
				})
				.filter((option) => option !== null);

			if (normalizedOptions.length === 0) {
				throw new Error(`Resolved optionsFromObject for source/components/${componentName}/component.json but no valid { value, label } option pairs were found.`);
			}

			setting.options = normalizedOptions;
			delete setting.optionsFromObject;
		}
	}
}

function buildScss(data) {
	const lines = [];

	lines.push('// ============================================================================');
	lines.push('// DESIGN TOKENS');
	lines.push('// ============================================================================');
	lines.push('//');
	lines.push(`// AUTO-GENERATED from source/data/design-tokens.json (v${data.version || '0.0.0'})`);
	lines.push('// DO NOT EDIT THIS FILE MANUALLY — changes will be overwritten.');
	lines.push('//');
	lines.push('// To modify design tokens, edit source/data/design-tokens.json and run:');
	lines.push('//   node build-design-tokens.mjs');
	lines.push('//');
	lines.push('// ============================================================================');
	lines.push('');
	lines.push(':root {');

	for (const category of data.categories) {
		lines.push('');
		lines.push('    // ' + '='.repeat(72));
		lines.push(`    // ${category.label}`);

		if (category.description) {
			lines.push(`    // ${category.description}`);
		}

		lines.push('    // ' + '='.repeat(72));

		for (const setting of category.settings) {
			const name = setting.variable;
			const value = formatValue(setting);

			lines.push(`    ${name}: ${value};`);
		}
	}

	lines.push('}');
	lines.push('');

	return lines.join('\n');
}

function formatValue(setting) {
	const val = setting.default;

	// Strings that are already CSS expressions (var(), calc(), etc.) pass through
	if (typeof val !== 'string') {
		return String(val);
	}

	// Font families and other quoted values — keep as-is
	if (val.startsWith('var(') || val.startsWith('calc(')) {
		return val;
	}

	return val;
}

// Main
const json = readFileSync(INPUT, 'utf-8');
const data = JSON.parse(json);
validateTokenData(data);
const scss = buildScss(data);

writeFileAtomic(OUTPUT, scss);

const tokenCount = data.categories.reduce((sum, c) => sum + c.settings.length, 0);
console.log(`Generated ${OUTPUT}`);
console.log(`  ${data.categories.length} categories, ${tokenCount} tokens`);

// Process component design tokens
if (existsSync(COMPONENT_DIR)) {
	const componentTokens = {};
	const componentErrors = [];
	const objectDefinitions = loadObjectDefinitions(OBJECT_DIR);
	const componentDirs = readdirSync(COMPONENT_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const componentName of componentDirs) {
		const tokenFile = join(COMPONENT_DIR, componentName, `component.json`);
		if (existsSync(tokenFile)) {
			try {
				const tokenData = JSON.parse(readFileSync(tokenFile, 'utf-8'));
				resolveComponentSettingOptionsFromObjects(componentName, tokenData, objectDefinitions);
				validateComponentTokenReferences(componentName, tokenData);
				componentTokens[componentName] = tokenData;
			} catch (error) {
				componentErrors.push(`Failed to parse ${tokenFile}: ${error.message}`);
			}
		}
	}

	if (componentErrors.length > 0) {
		throw new Error(componentErrors.join('\n'));
	}

	writeFileAtomic(COMPONENT_OUTPUT, JSON.stringify(componentTokens, null, 2));
	console.log(`Generated ${COMPONENT_OUTPUT}`);
	console.log(`  ${Object.keys(componentTokens).length} components processed`);
}
