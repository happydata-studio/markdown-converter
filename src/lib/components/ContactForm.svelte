<script lang="ts">
  
  
  
</script>

<div class="contact-form mx-auto max-w-lg">
  <fieldset class="grid grid-cols-2 gap-4 mb-4">
    <label class="label">
      <span>Your Name</span>
      <input class="input" type="text" placeholder="What's your name?" />
    </label>
    <label class="label">
      <span>Email</span>
      <input class="input" type="email" placeholder="Best Email Address?" />
    </label>
  </fieldset>
  <fieldset>
    <label class="label">
      <span>Email</span>
      <textarea class="input" placeholder="How can we help?" />
    </label>
  </fieldset>
  <fieldset class="flex items-center py-4 space-x-4">
    <div class="text-xs opacity-60 filler">By submitting your request, you are aggreeing to our Privacy Policy.</div>
    <button class="trans-all stiff bg-black hover:text-white text-yellow-500 px-4 py-2 rounded-md">Send Message →</button>
  </fieldset>
</div>


<style lang="postcss">
  label.label {
    @apply bg-white bg-opacity-20;
    @apply transition-all duration-200 ease-in-out;
    @apply flex flex-col;
    @apply rounded-md;
    @apply text-sm;
    @apply px-4 pt-3;
    @apply focus-within:ring-opacity-20;
    @apply focus-within:bg-opacity-90;
    @apply focus-within:ring focus-within:ring-yellow-600;
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
    @apply text-yellow-700;
  }
</style>