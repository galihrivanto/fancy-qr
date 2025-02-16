import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json' assert { type: 'json' }
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} **/
/** @type {import('rollup').RollupOptions} **/
export default defineConfig(({ command, mode }) => {
    if (command === 'build') {
        if (mode === 'samples') {
            return {
                plugins: [dts()],
                worker: {
                    format: 'es'
                },
                esbuild: {
                    drop: ['console', 'debugger']
                }
            }
        } else {
            return {
                publicDir: false,
                plugins: [dts()],
                worker: {
                    format: 'es'
                },
                esbuild: {
                    drop: ['console', 'debugger']
                },
                build: {
                    lib: {
                        entry: resolve(__dirname, './src/index.ts'),
                        name: pkg.name,
                        fileName: (format) => `fancyqr.${format}.js`,
                        formats: ['es']
                    }
                }
            }
        }
    } else {
        return {
            publicDir: false,
            plugins: [dts()],
            build: {
                lib: {
                    entry: resolve(__dirname, './src/index.ts'),
                    name: pkg.name,
                    fileName: (format) => `fancyqr.${format}.js`,
                    formats: ['es']
                }
            }
        }
    }
});