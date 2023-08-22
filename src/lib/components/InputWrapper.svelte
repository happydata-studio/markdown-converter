<script lang="ts">
  export let label:string = "";  
</script>
<label class="label">
  <div class="flex flex-col w-full">
    <span>{label}</span>
    <slot />
  </div>
  <slot name="right" />
</label>

<style lang="postcss" global>
  label.label {
    @apply bg-white bg-opacity-20;
    @apply dark:bg-gray-900;
    @apply transition-all duration-200 ease-in-out;
    @apply flex md:flex-row flex-col items-center;
    @apply rounded-md;
    @apply text-sm;
    @apply px-4 pt-3;

  }
  label.label:focus-within {
    @apply ring-opacity-20;
    @apply bg-opacity-90;
    @apply ring ring-blue-500;
    @apply dark:bg-black;
  }
  label.label > span {
    @apply -mb-2;
  }
  label .input {
    @apply bg-transparent;
    @apply border-none;
    @apply px-0;
  }
  label .input:focus {
    @apply ring-0
  }
  label .input::placeholder {
    @apply text-blue-500;
  }
</style>