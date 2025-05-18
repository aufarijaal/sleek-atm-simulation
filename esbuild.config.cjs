const esbuild = require('esbuild')
const path = require('path')

esbuild
    .build({
        entryPoints: ['src/main.ts'],
        bundle: true,
        outdir: 'dist',
        platform: 'node',
        target: 'esnext',
        outExtension: {
            '.js': '.cjs',
        },
        sourcemap: true,
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        external: [
            'tedious',
            'pg',
            'oracledb',
            'pg-query-stream',
            'mysql',
            'better-sqlite3',
            'sqlite3',
        ],
        minify: true,
        tsconfig: 'tsconfig.json',
    })
    .catch(() => process.exit(1))
