const svelte = require('svelte/compiler');
const { execSync } = require('child_process');
const { transformSync, transform } = require('@babel/core');

const styleRegex = /<style[^>]*>[\S\s]*?<\/style>/g;
const dynImportRegex = /\bimport\(/g;
const cwd = __dirname;

// Fixes the '_Sample.default is not a constructor' error when importing in Jest.
const esInterop = 'Object.defineProperty(exports, "__esModule", { value: true });';

module.exports = {

    /**
     * Create the transformer
     * @param {Object} transformOptions
     * @param {?Object} transformOptions.preprocess - the svelte preprocess config, if not, no preprocessing
     * @param {Object} transformOptions.compilerOptions - options for the Svelte compiler
     * @param {boolean} transformOptions.noStyles - to just remove styles from svelte sources
     * @returns {Object} the transformer
     */
    createTransformer(transformOptions) {
        const { preprocess: preprocessConfig, compilerOptions, noStyles } = transformOptions;

        /**
         * Normalize svelte sources (strip out styles if configured)
         * @param {string} source
         * @returns {string} the normalized source
         */
        function getNormalizedSource(source) {
            return noStyles !== false ? source.replace(styleRegex, '') : source;
        }

        /**
         * Compile the svelte source file
         * @param {string} source
         * @param {string} filename
         * @param {boolean} supportsStaticESM - if true we compiled to ESM
         * @returns {Object} the compilation object
         */
        function svelteCompile(source, filename, supportsStaticESM = false) {
            return svelte.compile(
                source,
                Object.assign(
                    {
                        filename,
                        css: false,
                        // Allow tests to set component props.
                        accessors: true,
                        // Debugging and runtime checks
                        dev: false,
                        // Emit CommonJS that Jest can understand.
                        format: supportsStaticESM ? 'esm' : 'cjs'
                    },
                    compilerOptions
                )
            );
        }

        //the transformer
        return {
            canInstrument: true,

            /**
             * Process a source file
             * @param {string} source
             * @param {string} filename
             * @param {Object} options - jest configuration options
             * @param {Object} config - runtime configuration
             * @returns {{code: string, map: string}} the transformation output
             */
            process(source, filename, options, config) {
                const { supportsDynamicImport, supportsStaticESM } = config;

                const normalized = getNormalizedSource(source);

                let preprocessed;

                if (preprocessConfig) {
                    preprocessed = execSync(`node "./preprocess.js"`, {
                        cwd,
                        env: {
                            PATH: process.env.PATH,
                            source: normalized,
                            filename,
                            config: JSON.stringify(preprocessConfig)
                        },
                        maxBuffer: 1 * 1024 * 1024
                    }).toString();
                } else {
                    preprocessed = normalized;
                }
                const compiled = svelteCompile(preprocessed, filename, supportsStaticESM, compilerOptions);

                if (!supportsDynamicImport && dynImportRegex.test(compiled.js.code)) {
                    const output = transformSync(compiled.js.code, {
                        configFile: false,
                        inputSourceMap: compiled.js.map,
                        sourceMaps: true,
                        compact: false,
                        plugins: [['babel-plugin-dynamic-import-node', { esInterop: true }]]
                    });

                    return {
                        code: output.code + esInterop,
                        map: output.map
                    };
                }
                return {
                    code: compiled.js.code + esInterop,
                    map: compiled.js.map
                };
            },

            /**
             * Process a source file.
             * Async way, most likely used when ESM support will be enabled in jest 27
             * @param {string} source
             * @param {string} filename
             * @param {Object} options - jest configuration options
             * @param {Object} config - runtime configuration
             * @returns {Promise<{code: string, map: string}>} the transformation output
             */
            processAsync(source, filename, options, config) {
                const { supportsDynamicImport, supportsStaticESM } = config;
                return Promise.resolve()
                    .then(() => {
                        const normalized = getNormalizedSource(source);

                        if (preprocessConfig) {
                            return svelte.preprocess(normalized, preprocessConfig, { filename });
                        }
                        return normalized;
                    })
                    .then(normalized => {
                        const compiled = svelteCompile(normalized, filename, supportsStaticESM, compilerOptions);

                        if (!supportsDynamicImport && dynImportRegex.test(compiled.js.code)) {
                            return transform(compiled.js.code, {
                                configFile: false,
                                inputSourceMap: compiled.js.map,
                                sourceMaps: true,
                                compact: false,
                                plugins: [['babel-plugin-dynamic-import-node', { esInterop: true }]]
                            }).then(output => ({
                                code: output.code + esInterop,
                                map: output.map
                            }));
                        }
                        return {
                            code: compiled.js.code + esInterop,
                            map: compiled.js.map
                        };
                    });
            }
        };
    }
};
