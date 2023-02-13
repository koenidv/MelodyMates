<script lang="ts">
	import { getSongColor } from "$lib/colors";
	import { createPost } from "$lib/db";
	import { currentlyPlaying } from "$lib/store";
	import { get } from "svelte/store";

	let lastsongId: string | undefined = undefined;
	let color: string | undefined = undefined;

	function updateColor() {
		if (!get(currentlyPlaying)?.song?.id) return;
		if (lastsongId === get(currentlyPlaying).song.id) return;
		getSongColor(get(currentlyPlaying).song.album.cover_image, get(currentlyPlaying).song.id).then(
			({ hex, songid }) => {
				color = hex;
			}
		);
		lastsongId = get(currentlyPlaying).song.id;
	}

	$: $currentlyPlaying, updateColor();

	function postCurrentSong() {
		const currentSong = get(currentlyPlaying).song;
		if (!currentSong) return;
		currentSong.album.theme_color = color || null;
		createPost(currentSong, null);
	}
</script>

<button
	class="h-12 bg-gray-700 rounded-xl p-3 disabled:bg-gray-900 disabled:text-gray-500 flex flex-row gap-2 grow justify-center content-baseline min-w-0 transition-colors duration-300 relative overflow-clip"
	style={color ? "background-color: " + color : ""}
	on:click={postCurrentSong}>
	{#if $currentlyPlaying?.song?.name}
		<img
			src={$currentlyPlaying?.song?.album?.cover_image || ""}
			alt=""
			class="absolute top-0 left-0 opacity-25 h-full w-full object-cover blur-md" />
		<svg
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="24"
			height="24"
			viewBox="0,0,255.99544,255.99544"
			style="fill:#000000;"
			class="relative z-10">
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
		<p class="whitespace-nowrap overflow-hidden overflow-ellipsis translate-y-[0.0625rem] relative z-10">
			{($currentlyPlaying?.song?.name.match(/^([^\(\-\|\/]+)/g) || ["Currently Playing"])[0].trim()}
		</p>
	{/if}
</button>
