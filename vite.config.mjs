import { createViteConfig } from 'vite-config-factory'

const entries = {
  'js/styleguide-js': './source/js/main.js',
  'css/styleguide-css': './source/sass/main.scss'
}

export default createViteConfig(entries, {
  outDir: 'assets/dist',
  manifestFile: 'manifest.json'
})