<script lang="ts">
	import '../app.postcss';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
</script>

<div id="app" class="min-h-screen w-screen dark:bg-gray-950 dark:text-white">
	<Header>
		<div slot="header"><slot name="header" /></div>
	</Header>
	<main style="min-height:calc(100vh - 140px);" class="z-0">
		<slot />
	</main>
</div>
<Footer />
<div>
	<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
	<noscript
		><img
			src="https://queue.simpleanalyticscdn.com/noscript.gif"
			alt=""
			referrerpolicy="no-referrer-when-downgrade"
		/></noscript
	>
</div>

<style global lang="postcss">
	html,
	body {
		@apply dark:bg-gray-900 !important;
		@apply bg-gray-200 !important;
	}
</style>
