<script lang="ts">
	import BottomBar from "$components/BottomBar.svelte";
	import Feed from "$components/Feed.svelte"
	import { startNowPlayingObserver, stopNowPlayingObserver } from "$lib/spotify";

	stopNowPlayingObserver();
	startNowPlayingObserver();
</script>

<div class="overflow-x-hidden">
	<Feed />
	<BottomBar />
</div>
