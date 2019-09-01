const svelte = require('svelte/compiler');

const process = (options = {}) => (source, filename, ...args) => {
	const result = svelte.compile(source, {
		...options,
		filename,
		format: 'cjs'
	});

	return result.js;
};

exports.createTransformer = (options) => {
	return {
		process: process(options)
	};
};
