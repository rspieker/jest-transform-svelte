const Path = require('path');
const deasync = require('deasync');
const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');

exports.process = (...args) => {
	const [, input] = args;
	const compiled = {};

	rollup
		.rollup({ input, plugins: [svelte()] })
		.then((bundle) => bundle.generate({ format: 'cjs', sourcemap: true }))
		.then((result) => Object.assign(compiled, result))
		.catch((error) => {
			throw error;
		});

	deasync.loopWhile(() => !compiled.code && !compiled.map);

	return compiled;
};
