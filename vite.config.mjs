import fs from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';
import { createViteConfig } from 'vite-config-factory';

const entries = {
	'js/styleguide-js': './source/js/main.js',
	'css/styleguide-css': './source/sass/main.scss',
	'js/design-builder': './source/design-builder/index.ts',
	'css/design-builder-external': './source/design-builder/design-builder-external.css',
};

for (const component of fs.readdirSync('./source/components', { withFileTypes: true })) {
    if (!component.isDirectory()) continue;
    const name = component.name;
    if (fs.existsSync(`./source/components/${name}/style.scss`)) {
        entries[`css/components/${name}`] = `./source/components/${name}/entry.scss`;
    }
    if (fs.existsSync(`./source/components/${name}/entry.ts`)) {
        entries[`js/components/${name}`] = `./source/components/${name}/entry.ts`;
    }
}

const preferredUtilityOrder = JSON.parse(fs.readFileSync('./source/utilities/order.json', 'utf8'));
const discoveredUtilities = fs.readdirSync('./source/utilities', { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(`./source/utilities/${entry.name}/style.scss`))
    .map((entry) => entry.name);
const utilityOrder = [
    ...preferredUtilityOrder.filter((name) => discoveredUtilities.includes(name)),
    ...discoveredUtilities.filter((name) => !preferredUtilityOrder.includes(name)).sort(),
];
for (const name of utilityOrder) {
    entries[`css/utilities/${name}`] = `./source/utilities/${name}/entry.scss`;
}

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

const utilityClassMapPlugin = () => ({
    name: 'utility-class-map',
    apply: 'build',
    closeBundle() {
        const classes = {};
        const manifest = JSON.parse(fs.readFileSync('assets/dist/manifest.json', 'utf8'));
        for (const name of utilityOrder) {
            const asset = manifest[`css/utilities/${name}.css`];
            if (!asset) throw new Error(`Missing built CSS for utility ${name}`);
            const path = `assets/dist/${asset}`;
            postcss.parse(fs.readFileSync(path, 'utf8')).walkRules((rule) => {
                for (const match of rule.selector.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) {
                    const className = match[1]
                        .replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
                        .replace(/\\(.)/g, '$1');
                    if (!className.startsWith('u-')) continue;
                    const bundles = (classes[className] ??= []);
                    if (!bundles.includes(name)) bundles.push(name);
                }
            });
        }
        fs.writeFileSync('assets/dist/utility-class-map.json', JSON.stringify({ order: utilityOrder, classes }));
    },
});

export default ({ command, mode }) => {
	mode = 'development';
	const config = createViteConfig(entries, {
		outDir: 'assets/dist',
		manifestFile: 'manifest.json',
	})({ command, mode });
	return {
		...config,
		plugins: [...(config.plugins ?? []), utilityClassMapPlugin()],
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
