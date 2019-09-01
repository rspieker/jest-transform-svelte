const svelte = require('svelte/compiler');

const process = (options = {}) => (source, filename) => {
	// strip out <style> tags to prevent errors when unable to parse PostCSS etc.
	const re = /<style[^>]*>[\S\s]*?<\/style>/g;
	const normalized = source.replace(re, '');

	const result = svelte.compile(normalized, {
		...options,
		filename,
		accessors: true,
		dev: true,
		css: false,
		format: 'cjs'
	});

	// Fixes the '_Sample.default is not a constructor' error when importing in Jest.
	const esInterop =
		'Object.defineProperty(exports, "__esModule", { value: true });';

	return {
		code: result.js.code + esInterop,
		map: result.js.map
	};
};

exports.createTransformer = (options) => {
	return {
		process: process(options)
	};
};
