const svelte = require('svelte/compiler');
const { source, filename, config } = process.env;

const preprocessConfig = JSON.parse(config);
svelte.preprocess(source, preprocessConfig, { filename }).then(r => {
    process.stdout.write(r.code);
});
