<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
	import { createEventDispatcher, onMount } from 'svelte';
	import { downloadStringAsFile } from '../lib/utils/download';
	import MarkdownRender from '../components/markdown-render/markdown-render.svelte';
	const dispatch = createEventDispatcher();
	const allowed = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];

	let markdown:string = "";
  let loading: boolean = false;
  let inputEle: HTMLInputElement;
  let lastFileName: string;
  let lastFileType: string;

	async function convertFile(file: File) {
    loading = true;
    lastFileName = file.name;
    lastFileType = file.type;
		try {
			dispatch('loading');
			const response = await fetch('/api/convert', {
				// Replace '/your-endpoint' with your actual server endpoint
				method: 'POST',
				headers: {
					'Content-Type': file.type,
				},
				body: file
			});

      if (!response.ok) {
				alert(`Error: ${response.statusText}`);
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
      markdown = data.markdown;
      loading = false;
			return data;
		} catch (error) {
			console.error('An error occurred while sending the PDF file.', error);
      loading = false;
		}
	}

  const download = ()=>{
    downloadStringAsFile(markdown, `${lastFileName}.md`);
  }

  const selectFiles = ()=>{
    inputEle.click();
  }

	async function onChangeHandler(e: any) {
		const files = e.target.files;
		const file: File = files[0];

		try {
			if (file) {
				if (allowed.indexOf(file.type) > -1) {
					const results = await convertFile(file);
					dispatch('text', results.text);
				} else {
					alert(`Sorry we don't support ${file.type}`);
				}
			}
		} catch (e) {
			console.error(e);
		}
		// const file = e.srcElement.files[0];
	}
</script>

<div class="fixed z-40 top-3 right-4 flex items-center space-x-2">
  {#if markdown}
  <button class=" bg-green-500 text-white font-semibold rounded-md py-2 px-4" on:click={download}>Download ↓</button>
  {/if}
  <button class=" bg-blue-500 text-white font-semibold rounded-md py-2 px-4" on:click={selectFiles}>Select File...</button>

</div>
<input class="hidden" bind:this={inputEle} type="file" accept={allowed.join(",")} on:change={onChangeHandler} />

{#if loading}
  <div class="text-xs w-full h-[70vh] flex items-center justify-center">
    <div class="animate-spin w-4 h-4 stiff">♻️</div>
    Converting {lastFileName}...
  </div>
{:else if markdown}
<div class="w-full bg-white p-10">
	<div class="max-w-screen-md mx-auto">
		<MarkdownRender {markdown} />
	</div>
</div>
{:else}
<div class="w-full h-[70vh] flex items-center justify-center">
  <button class="underline" on:click={selectFiles}>
    Select a PDF, Doc or Docx to convert to markdown.
  </button>
</div>

{/if}