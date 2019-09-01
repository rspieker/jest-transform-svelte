const svelte = require('svelte/compiler');
const deasync = require('deasync');

const process = (options = {}) => (source, filename) => {
	const { preprocess } = options;

	let preprocessed;

	if (preprocess) {
		svelte
			.preprocess(source, preprocess || {}, {
				filename
			})
			.then((result) => (preprocessed = result.code));

		deasync.loopWhile(() => !preprocessed);
	} else {
		preprocessed = source;
	}

	const compiled = svelte.compile(preprocessed, {
    filename,
    css: false,
    // Allow tests to set component props.
    accessors: true,
    // Debugging and runtime checks
    dev: true,
    // Emit CommonJS that Jest can understand.
		format: 'cjs'
	});

	// Fixes the '_Sample.default is not a constructor' error when importing in Jest.
	const esInterop =
		'Object.defineProperty(exports, "__esModule", { value: true });';

	return {
		code: compiled.js.code + esInterop,
		map: compiled.js.map
	};
};

exports.createTransformer = (options) => {
	return {
		process: process(options)
	};
};
