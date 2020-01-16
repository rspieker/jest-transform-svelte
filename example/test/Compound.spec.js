import { tick } from 'svelte';
import Compound from '../source/Compound.svelte';

test('has a button and the Sample', (done) => {
	//  create a new element
	const target = document.createElement('div');
	//  render the component in the new element
	const sample = new Compound({ target });

	tick().then(() => {
		expect(target.querySelector('button')).toBeTruthy();
		expect(target.querySelector('[data-clicks="0"]')).toBeTruthy();

		done();
	});
});
