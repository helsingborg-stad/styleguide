import { defineConfig } from 'vite'
import { resolve } from 'path'
const { manifestPlugin } = await import('vite-plugin-simple-manifest').then(m => m.default || m)

// Entry points configuration matching the original webpack config
const entries = {
  'js/styleguide-js': './source/js/main.js',
  'css/styleguide-css': './source/sass/main.scss',
  'js/buildcss': './build/index.js',
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    build: {
      outDir: 'assets/dist',
      emptyOutDir: false, // Keep existing assets
      rollupOptions: {
        input: entries,
        output: {
          entryFileNames: isProduction ? '[name].[hash].min.js' : '[name].min.js',
          chunkFileNames: isProduction ? '[name].[hash].min.js' : '[name].min.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return isProduction ? '[name].[hash].min.css' : '[name].min.css'
            }
            return 'assets/[name].[hash].[ext]'
          }
        }
      },
      minify: isProduction ? 'esbuild' : false,
      sourcemap: true
    },
    esbuild: {
      keepNames: true,
      minifyIdentifiers: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          includePaths: ['node_modules', 'source'],
          importers: [
            {
              findFileUrl(url) {
                if (url.startsWith('~')) {
                  return new URL(url.slice(1), new URL('../node_modules/', import.meta.url))
                }
                return null
              }
            }
          ]
        }
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
      alias: {
        '~': resolve(process.cwd(), 'node_modules')
      }
    },
    plugins: [manifestPlugin('manifest.json')]
  }
})