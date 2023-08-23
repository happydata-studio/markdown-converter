<script lang="ts">
	import MD from 'markdown-it';
	import MDFR from 'markdown-it-front-matter';
	import { parse } from 'yaml';
	import mila from 'markdown-it-link-attributes';
	import taskList from 'markdown-it-task-lists';
	export let className: string = '';
	export let markdown: string = '';
	export let html: string = '';
	const md = MD({
		linkify: true
	})
		.use(taskList)
		.use(mila, {
			attrs: {
				target: '_blank',
				rel: 'noopener'
			}
		});

	const mount = async () => {
		html = md.render(markdown);
	};
	$: if (markdown) {
		mount();
	}
</script>

<section class="prose lg:prose-xl dark:text-white {className}">
	{@html html}
</section>
