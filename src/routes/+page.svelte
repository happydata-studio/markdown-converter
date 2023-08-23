<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
	import { createEventDispatcher, onMount } from 'svelte';
	import { downloadStringAsFile } from '../lib/utils/download';
	import MarkdownRender from '../lib/components/markdown-render/markdown-render.svelte';
	import { saveAs } from 'file-saver';
	const dispatch = createEventDispatcher();
	const allowed = [
		'text/plain',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/markdown'
	];

	let markdown: string = '';
	let loading: boolean = false;
	let inputEle: HTMLInputElement;
	let lastFileName: string;
	let lastFileType: string;
	let activeFile: string = '';

	interface FileStatus {
		finished: boolean;
		state: string;
		markdown?: string;
	}

	let files: File[] = [];
	let processState: Record<string, FileStatus> = {};

	async function downloadAll() {
		const finished = Object.keys(processState).map((fileName: string) => {
			return {
				...processState[fileName],
				...{ name: `${fileName}.md`, type: 'application/markdown' }
			};
		});
		for (const file of finished) {
			//@ts-ignore
			let blob = new Blob([`${file.markdown}`, { type: 'text/plain;charset=utf-8' }]);
			let a = document.createElement('a');
			document.body.appendChild(a);
			a.style.display = 'none';
			a.href = window.URL.createObjectURL(blob);
			a.download = file.name;
			a.click();
		}
	}

	async function convertFile(file: File) {
		processState[file.name] = processState[file.name] || {
			state: 'Processing',
			finished: false,
			markdown: null
		};
		loading = true;
		lastFileName = file.name;
		lastFileType = file.type;
		try {
			dispatch('loading');
			const response = await fetch('/api/convert', {
				// Replace '/your-endpoint' with your actual server endpoint
				method: 'POST',
				headers: {
					'Content-Type': file.type
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

			processState[file.name] = {
				state: 'Done',
				finished: true,
				markdown: data.markdown
			};
			processState = processState;
			activeFile = file.name;
			convertNext();
			return data;
		} catch (error: any) {
			console.error('An error occurred while sending the PDF file.', error);
			loading = false;
			processState[file.name] = {
				state: error.message,
				finished: false,
				markdown: error.message
			};
			convertNext();
		}
	}

	const convertNext = async () => {
		const remaining = files.filter((f) => {
			return !processState[f.name];
		});
		if (remaining.length) {
			await convertFile(remaining[0]);
		}
	};

	const download = () => {
		downloadStringAsFile(markdown, `${lastFileName}.md`);
	};

	const selectFiles = () => {
		inputEle.click();
	};

	async function onChangeHandler(e: any) {
		const uploaded = e.target.files;
		files = [];
		for (const file of uploaded) {
			if (allowed.indexOf(file.type) > -1) {
				files.push(file);
			}
		}

		// try {
		// 	if (file) {
		// 		if (allowed.indexOf(file.type) > -1) {
		// 			const results = await convertFile(file);
		// 			dispatch('text', results.text);
		// 		} else {
		// 			alert(`Sorry we don't support ${file.type}`);
		// 		}
		// 	}
		// } catch (e) {
		// 	console.error(e);
		// }
		// const file = e.srcElement.files[0];
	}
</script>

<div class="fixed right-4 top-3 z-40 flex items-center space-x-2">
	{#if markdown}
		<button
			class=" rounded-md bg-green-500 px-4 py-2 font-semibold text-white"
			on:click={downloadAll}>Download All ↓</button
		>
	{/if}
	<button class=" rounded-md bg-blue-500 px-4 py-2 font-semibold text-white" on:click={selectFiles}
		>Select Files...</button
	>
</div>
<input
	class="hidden"
	multiple={true}
	bind:this={inputEle}
	type="file"
	accept={allowed.join(',')}
	on:change={onChangeHandler}
/>
<div class="flex w-screen z-0" style="height:calc(100vh - 60px)">
	{#if files.length}
		<div
			class="w-[270px] border-t bg-white min-w-[270px] max-w-[270px] overflow-y-auto border-r border-gray-200"
			style="height:calc(100vh - 60px)"
		>
			<div class="p-2">
				<button
					class="w-full rounded-md bg-blue-500 px-3 py-2 text-center text-white"
					on:click={convertNext}>Convert to Markdown →</button
				>
			</div>
			<div>
				{#each files as file}
					<button
						on:click={() => (activeFile = file.name)}
						class:active={file.name === activeFile}
						class="flex w-full items-center justify-start space-x-1 border-b border-gray-200 px-4 py-2 text-left text-xs"
					>
						<div class="filler space-x-1 flex items-center w-full text-xs">
							{#if processState[file.name]}
								{#if processState[file.name].finished}
									<span>✅</span>
								{:else}
									<span class="h-4 w-4 animate-spin">♻️</span>
								{/if}
							{/if}
							<span class="truncate-1 flex w-[200px] overflow-hidden">{file.name}</span>
						</div>
						<div class="stiff text-xs font-bold">
							{#if processState[file.name]}
								{processState[file.name].state}
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if activeFile && processState[activeFile]?.markdown}
		<div class="w-full overflow-y-auto bg-white p-10" style="height:calc(100vh - 60px)">
			<h1 class="mb-4 flex items-center justify-between border-b border-gray-400 pb-4 text-2xl font-bold">
				<span>{activeFile}</span>
				<button
					class=" rounded-md text-sm bg-green-500 px-4 py-2 font-semibold text-white"
					on:click={() => {
						downloadStringAsFile(`${processState[activeFile]?.markdown}`, `${activeFile}.md`);
					}}>Download ↓</button
				>
			</h1>
			<div class="mx-auto max-w-screen-md">
				<MarkdownRender markdown={processState[activeFile].markdown} />
			</div>
		</div>
	{/if}
	{#if !files.length}
		<div class="flex h-[70vh] w-full items-center justify-center">
			<button
				class="rounded-md border-4 border-dashed border-gray-300 p-10 transition-all duration-200 ease-in-out hover:bg-white"
				on:click={selectFiles}
			>
				<h1 class="text-2xl font-bold">Upload Files...</h1>
				<p>Select a PDF, Doc or Docx to convert to markdown.</p>
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	button.active {
		@apply bg-green-200;
	}
</style>
