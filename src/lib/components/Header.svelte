<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import icon from "../../../static/icon.svg";
	export let active = 'ui';
	const dispatch = createEventDispatcher();

	interface NavItem {
		name: string;
		id: string;
	}

</script>

<header class="z-20 bg-opacity-20 backdrop-blur-md backdrop-filter fixed top-0 mb-6 flex h-16 w-screen items-center justify-center">
	<a href="/" class="trans-all flex items-center space-x-2 btn-2-white absolute left-6 font-mono text-black">
		<img src="/icon.svg" class="w-7" alt="mdown.app icon" />
		<span class="dark:text-white">Markdown Converter</span>
	</a>
	<slot name="header" />
</header>
<div class="h-16" />

<!--
<LocaleSwitcher />

<ThemeSwitcher /> -->

<style lang="postcss">
	.nav-button {
		@apply transition-all duration-200 ease-in-out;
		@apply font-mono;
		@apply text-sm;
		@apply px-4 py-2;
		@apply rounded-md;
		@apply text-black;
		@apply hover:bg-white hover:bg-opacity-20;
	}
	.nav-button.active {
		@apply bg-white;
		@apply font-bold;
	}
	.btn-2-white {
		@apply rounded-md;
	}
	.btn-2-white:hover {
		@apply bg-white;
		@apply text-sm;
		@apply px-3;
		@apply py-2;
	}
</style>
