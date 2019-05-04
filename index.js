const deasync = require('deasync');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');

exports.process = (...args) => {
	const [, input] = args;
	const compiled = {};

	rollup
		.rollup({ input, plugins: [svelte(), resolve()] })
		.then((bundle) => bundle.generate({ format: 'cjs', sourcemap: true }))
		.then(({ output }) => output
			.reduce((carry, record) => Object.assign(carry, record), compiled)
		)
		.catch((error) => {
			throw error;
		});

	deasync.loopWhile(() => !compiled.code && !compiled.map);

	return compiled;
};
