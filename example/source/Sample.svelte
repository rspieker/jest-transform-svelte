<span on:click="{ updateClicks }" data-clicks="{ clicks }" data-length="{ length }">{ text }</span>

<svelte:options accessors="{ true }" />

<script lang="typescript">
	//  internal click counter
	let clicks: number = 0;
	//  allow for text overrides
	export let text = '';

	//  handler for the click event
	function updateClicks() {
		++clicks;
	}

	//  "computed" text length
	$: length = text.length;
</script>
