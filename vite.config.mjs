import { createViteConfig } from 'vite-config-factory'
import sass from 'sass';
import fs from 'fs';

const entries = {
  'js/styleguide-js': './source/js/main.js',
  'css/styleguide-css': './source/sass/main.scss',
  'js/design-builder': './source/design-builder/index.ts',
  'css/design-builder': './source/design-builder/design-builder.scss'
}

const getComponentConfig = (name) => {
  const configPath = `./source/data/${name}.json`;

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
  'getComponentTokens($name)': args =>
    new sass.SassList(
      getComponentConfig(
        args[0].assertString('name').text
      ).map(token => new sass.SassString(token)),
      { separator: ',' }
    )
}

export default (() => {
  const config = createViteConfig(entries, {
    outDir: 'assets/dist',
    manifestFile: 'manifest.json'
  })({ mode: 'production' });

  return () => {
    return {
      ...config,
      css: {
        preprocessorOptions: {
          scss: {
            functions: customSassFunctions,
          },
        },
      }
    }
  }
})();