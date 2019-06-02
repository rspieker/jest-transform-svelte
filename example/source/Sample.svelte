<span data-length="{ length }">{ text }</span>

<script>
	//  allow for text overrides
	export let text = '';

	//  "computed" text length
	$: length = text.length;
</script>
