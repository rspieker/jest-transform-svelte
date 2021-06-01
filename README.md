# OAT Jest Transformer for Svelte

Forked from [rspieker/jest-transform-svelte](https://github.com/rspieker/jest-transform-svelte).

It transforms Svelte files to files Jest can use for testing.
It comes with Svelte preprocessing, styles skipping and dynamic import support.

## Installation

```sh
npm install --save-dev @oat-sa/jest-transform-svelte
```

## Configuration

Simply add the component to the [Jest transform configuration](https://jestjs.io/docs/en/configuration#transform-object-string-string)

```
transform: {
	'^.+\\.svelte$': [
		'@oat-sa/jest-transform-svelte',
		{
			compilerOptions: { dev: false },
			preprocess: [sveltePreprocess({ postcss: true })]
		}
	]
}
```

The transformer supports the following options:

 - `compilerOptions`: Svelte compiler options
 - `preprocess`: Svelte preprocessor

# LICENSE

MIT License

Copyright (c) 2021 Open Assessment technologies SA
Copyright (c) 2018-2019 Rogier Spieker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

