import fs from 'node:fs';
import * as sass from 'sass';
import { createViteConfig } from 'vite-config-factory';

const entries = {
	'js/styleguide-js': './source/js/main.js',
	'css/styleguide-css': './source/sass/main.scss',
	'js/design-builder': './source/design-builder/index.ts',
	'css/design-builder-external': './source/design-builder/design-builder-external.css',
};

const getComponentConfig = (name) => {
	// Strip "c-" prefix if present for component lookup
	const componentName = name.startsWith('c-') ? name.substring(2) : name;

	// Handle special case mappings
	let mappedName = componentName;
	if (componentName === 'modal--gallery') {
		mappedName = 'gallery--modal';
	}

	// Try new component structure first
	const newConfigPath = `./source/components/${mappedName}/component.json`;
	// Fallback to old structure for compatibility
	const oldConfigPath = `./source/data/c-${componentName}.json`;

	let configPath = newConfigPath;

	if (!fs.existsSync(newConfigPath) && fs.existsSync(oldConfigPath)) {
		configPath = oldConfigPath;
	}

	if (!fs.existsSync(configPath)) {
		console.warn(`Config file for component "${name}" not found at ${configPath}`);
		return [];
	}
	try {
		return JSON.parse(fs.readFileSync(configPath, 'utf8')).tokens || [];
	} catch (error) {
		console.error(`Error loading config for component "${name}":`, error);
		return [];
	}
};

const customSassFunctions = {
	'getComponentTokens($name)': (args) =>
		new sass.SassList(
			getComponentConfig(args[0].assertString('name').text).map((token) => new sass.SassString(token)),
			{ separator: ',' },
		),
};

export default ({ command, mode }) => {
	mode = 'development';
	const config = createViteConfig(entries, {
		outDir: 'assets/dist',
		manifestFile: 'manifest.json',
	})({ command, mode });
	return {
		...config,
		css: {
			...config.css,
			preprocessorOptions: {
				...config.css.preprocessorOptions,
				scss: {
					...config.css.preprocessorOptions?.scss,
					functions: customSassFunctions,
				},
			},
		},
	};
};
