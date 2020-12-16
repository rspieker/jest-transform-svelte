const svelte = require('svelte/compiler');
const { execSync } = require('child_process');

const styleRegex = /<style[^>]*>[\S\s]*?<\/style>/g;

const transform = (options = {}) => (source, filename) => {
	const {
		preprocess,
		debug,
		compilerOptions,
		noStyles
	} = options;

	console.log(preprocess);
	// strip out <style> tags to prevent errors with node-sass.
	const normalized = noStyles !== false ? source.replace(styleRegex, '') : source;

	let preprocessed;

	if (preprocess) {
		const preprocessor = require.resolve('./preprocess.js');
		preprocessed = execSync(`node --unhandled-rejections=strict --abort-on-uncaught-exception "${preprocessor}"`, {
			env: {
				PATH: process.env.PATH,
				source: normalized,
				filename,
				config: JSON.stringify(preprocess)
			},
			maxBuffer: 10 * 1024 * 1024
		}).toString();
	} else {
		preprocessed = normalized;
	}

	const compiled = svelte.compile(preprocessed, {
		filename,
		css: false,
		// Allow tests to set component props.
		accessors: true,
		// Debugging and runtime checks
		dev: true,
		// Emit CommonJS that Jest can understand.
		format: 'cjs',
		...compilerOptions
	});

	// Fixes the '_Sample.default is not a constructor' error when importing in Jest.
	const esInterop =
		'Object.defineProperty(exports, "__esModule", { value: true });';

	const code = compiled.js.code + esInterop;

	if (debug) {
		console.log(code);
	}

	return {
		code,
		map: compiled.js.map
	};
};

exports.createTransformer = (options) => {
	return {
		process: transform(options)
	};
};

