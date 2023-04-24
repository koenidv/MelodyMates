<script lang="ts">
	import { searchSongs } from "$lib/spotify";
	import debounce from "lodash/debounce";
	import { createPost, searchUsers, type Song } from "$lib/db";
	import { goto } from "$app/navigation";

	let searchterm = "";
	let results_spotify: Song[] = [];
	let results_users: { id: string; name: string; image: string }[] = [];

	const handleInput = debounce(async (e) => {
		if (!searchterm) {
			results_spotify = [];
			return;
		}

		searchUsers(searchterm).then((res) => {
			results_users = res;
			console.log("this");
			console.log(results_users);
		});
		searchSongs(searchterm).then((res) => {
			results_spotify = res;
		});
	}, 500);

	function clearResultsIfNecessary() {
		if (searchterm) return;
		results_spotify = [];
		results_users = [];
	}
	$: searchterm, clearResultsIfNecessary();
</script>

<div class="feed p-4 h-full pb-[4.5rem] overflow-y-auto">
	<div
		class="fixed flex flex-row gap-4 items-center left-4 right-4 top-0 pt-4 bg-gradient-to-b from-black via-black to-transparent z-10">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="text"
			autofocus
			placeholder="Search songs"
			bind:value={searchterm}
			on:input={handleInput}
			class="rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-gray-800 h-14 w-full shadow-2xl" />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<img
			src="/icons/close.svg"
			alt="Close"
			class="h-8 w-8 opacity-90"
			on:click={() => goto("/home")} />
	</div>

	<!-- User results -->
	<div id="users" class="flex flex-row gap-2 mt-[4.5rem] overflow-x-scroll">
		{#each results_users as user}
			<a
				href="/user/{user.id}"
				class="flex flex-col gap-2 bg-gray-900 w-32 min-w-[8rem] h-24 relative rounded-lg justify-end p-2">
				{#if user.image}
					<img
						src={user.image}
						alt=""
						class="absolute top-0 left-0 opacity-50 h-full w-full object-cover blur-sm" />
				{/if}
				<p class="text-md z-[1]">{user.name}</p>
			</a>
		{/each}
	</div>

	<!-- Song results -->
	<div id="songs" class="flex flex-col gap-2 {results_users.length > 0 ? 'mt-4' : ''}">
		{#each results_spotify as song}
			<div
				class="w-full rounded-lg p-2 bg-gray-800 flex flex-row gap-2 relative overflow-clip"
				style="background-color: {song.album.theme_color}">
				<img
					src={song.album.cover_image}
					alt=""
					class="absolute top-0 left-0 opacity-25 h-full w-full object-cover blur-md" />
				<img src={song.album.cover_image} alt="" class="w-12 h-12 object-cover rounded-lg" />
				<div class="flex flex-col grow basis-0">
					<p>{song.name}</p>
					<p class="opacity-75">
						{song.artists[0]?.name}
					</p>
				</div>
				<!-- Share Icon -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<svg
					on:click={async () => {
						await createPost(song, null);
						goto("/home");
					}}
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="24"
					height="24"
					viewBox="0,0,255.99544,255.99544"
					class="relative w-8 h-8 self-center">
					<g
						fill="#ffffff"
						fill-rule="nonzero"
						stroke="none"
						stroke-width="1"
						stroke-linecap="butt"
						stroke-linejoin="miter"
						stroke-miterlimit="10"
						stroke-dasharray=""
						stroke-dashoffset="0"
						font-family="none"
						font-weight="none"
						font-size="none"
						text-anchor="none"
						style="mix-blend-mode: normal"
						><g transform="scale(10.66667,10.66667)"
							><path
								d="M12,2c-5.514,0 -10,4.486 -10,10c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10zM14.586,12l-1.586,-1.586v5.586c0,0.552 -0.448,1 -1,1v0c-0.552,0 -1,-0.448 -1,-1v-5.586l-1.586,1.586c-0.39,0.39 -1.024,0.39 -1.414,0v0c-0.39,-0.39 -0.39,-1.024 0,-1.414l3.293,-3.293c0.39,-0.39 1.024,-0.39 1.414,0l3.293,3.293c0.39,0.39 0.39,1.024 0,1.414v0c-0.39,0.39 -1.024,0.39 -1.414,0z" /></g
						></g>
				</svg>
			</div>
		{/each}
	</div>
</div>
