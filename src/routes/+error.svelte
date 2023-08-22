<script lang="ts">
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';
	import { onMount } from 'svelte';

  onMount(()=>{
    const path = $page.url.pathname.slice(1);
    if(path.length) {
      const encoded = encodeURIComponent(path);
      goto(`/${encoded}`);
    }
  })
</script>