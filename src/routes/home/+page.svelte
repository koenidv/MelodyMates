<script lang="ts">
	import BottomBar from '$components/BottomBar.svelte';
	import { startNowPlayingObserver, stopNowPlayingObserver } from '$lib/spotify';

	stopNowPlayingObserver();
	startNowPlayingObserver();
</script>

<div>
	<div class="fixed bottom-0 left-0">
		<BottomBar />
	</div>
</div>
