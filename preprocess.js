const svelte = require('svelte/compiler');
const sveltePreprocess = require('svelte-preprocess');
const { source, filename, config } = process.env;

let preprocessConfig = {};
try {
	preprocessConfig = JSON.parse(config);
} catch(err){
}

svelte.preprocess(source, preprocessConfig, { filename }).then((r) => {
	process.stdout.write(r.code);
});
