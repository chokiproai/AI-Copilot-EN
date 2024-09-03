import obfuscator from 'rollup-plugin-obfuscator';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

// rollup.config.mjs
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
    input: 'cloudflare/worker.js',
    output: [
        {
            file: 'worker.js',
            format: 'es',
        }
    ],
    plugins:[
        obfuscator({
            // global:false,
            // include:["cloudflare/src/OPTIONS.js","cloudflare/src/bingapi.js"],
			options: {
				// Your javascript-obfuscator options here
				// See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
                compact: false,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                debugProtectionInterval: 0,
                disableConsoleOutput: false,
                identifierNamesGenerator: 'mangled',
                log: false,
                numbersToExpressions: false,
                renameGlobals: false,
                selfDefending: false,
                simplify: true,
                // splitStrings: true,
                // splitStringsChunkLength:10,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 1,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersType: 'variable',
                stringArrayThreshold: 1,
                unicodeEscapeSequence: false
			},
		}),
        compiler({
            compilation_level:"ADVANCED"
        })
    ]
};