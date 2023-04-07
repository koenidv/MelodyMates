<script lang="ts">
	import { searchSongs } from "$lib/spotify";
	import debounce from "lodash/debounce";
	import type { Song } from "$lib/db";

	let searchterm = "";
	let results: Song[] = [];

	const handleInput = debounce(async (e) => {
		if (!searchterm) {
			results = [];
			return;
		}

		results = await searchSongs(searchterm);
	}, 500);
</script>

<div class="feed p-4 h-full pb-[4.5rem] overflow-y-auto">
	<input
		type="text"
		placeholder="Search songs"
		bind:value={searchterm}
		on:input={handleInput}
		class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-gray-800 h-14" />
</div>

{JSON.stringify(results)}
