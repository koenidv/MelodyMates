<script lang="ts">
	import { goto } from "$app/navigation";

	function redirectHome() {
		throw goto("/home");
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
	src="/icons/close.svg"
	alt="Close"
	class="absolute top-6 right-6 self-end h-8 w-8 opacity-90"
	on:click={redirectHome} />
