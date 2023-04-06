<script lang="ts">
	import BottomBar from "$components/BottomBar.svelte";
	import { startNowPlayingObserver, stopNowPlayingObserver } from "$lib/spotify";

	stopNowPlayingObserver();
	startNowPlayingObserver();
</script>

<div class="overflow-x-hidden h-full">
	<slot />
	<BottomBar />
</div>
