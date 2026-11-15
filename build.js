'use strict';
// Usage: node build.js
// Builds dist/ from the UMD source with esbuild:
//   .cjs      CommonJS
//   .mjs      ESM (default + named exports)
//   .js       IIFE (global `JapaneseSyllabary`), plus minified .min.js
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const entry = path.join(__dirname, 'src', 'japanese-syllabary.js');
const API = ['isHiragana', 'isKatakana', 'isHalfKatakana', 'normalizeKana',
    'denormalizeKana', 'toHiragana', 'toKatakana', 'toHalfKatakana'];

const common = { bundle: true, target: 'es2020', legalComments: 'inline', logLevel: 'info' };
const iife = { ...common, entryPoints: [entry], format: 'iife', globalName: 'JapaneseSyllabary' };

// The source is UMD (default export only when bundled), so wrap it to add named ESM exports.
const esmEntry = `import m from './japanese-syllabary.js';
export const { ${API.join(', ')} } = m;
export default m;
`;

const SIGNATURES = {
    isHiragana: '(value: string) => boolean',
    isKatakana: '(value: string) => boolean',
    isHalfKatakana: '(value: string) => boolean',
    normalizeKana: '(value: string) => string',
    denormalizeKana: '(value: string) => string',
    toHiragana: '(value: string) => string',
    toKatakana: '(value: string) => string',
    toHalfKatakana: '(value: string) => string'
};

function typings() {
    const members = Object.entries(SIGNATURES).map(([k, v]) => `    ${k}: ${v};`).join('\n');
    const named = Object.entries(SIGNATURES).map(([k, v]) => `export declare const ${k}: ${v};`).join('\n');
    const iface = `export interface JapaneseSyllabary {\n${members}\n}\n`;
    return {
        // ESM: named exports + default
        'japanese-syllabary.d.mts': `${iface}${named}\ndeclare const JapaneseSyllabary: JapaneseSyllabary;\nexport default JapaneseSyllabary;\n`,
        // CommonJS: `export =` so both require() and named destructuring type-check
        'japanese-syllabary.d.cts': `declare namespace JapaneseSyllabary {\n    interface Api {\n${members.replace(/^/gm, '    ')}\n    }\n}\ndeclare const JapaneseSyllabary: JapaneseSyllabary.Api;\nexport = JapaneseSyllabary;\n`,
        // Global (<script> tag)
        'japanese-syllabary.global.d.ts': `${iface}declare const JapaneseSyllabary: JapaneseSyllabary;\n`
    };
}

async function build(outdir = path.join(__dirname, 'dist')) {
    const out = name => path.join(outdir, name);
    fs.mkdirSync(outdir, { recursive: true });
    for (const [name, text] of Object.entries(typings())) fs.writeFileSync(out(name), text);
    await Promise.all([
        esbuild.build({ ...common, entryPoints: [entry], format: 'cjs', platform: 'node', outfile: out('japanese-syllabary.cjs') }),
        esbuild.build({
            ...common, format: 'esm', outfile: out('japanese-syllabary.mjs'),
            stdin: { contents: esmEntry, resolveDir: path.dirname(entry), sourcefile: 'esm-entry.js' }
        }),
        esbuild.build({ ...iife, outfile: out('japanese-syllabary.js') }),
        esbuild.build({ ...iife, minify: true, sourcemap: true, outfile: out('japanese-syllabary.min.js') })
    ]);
}

module.exports = { build };

if (require.main === module) {
    build().catch(() => process.exit(1));
}
