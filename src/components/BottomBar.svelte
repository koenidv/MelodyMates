<script lang="ts">
	import ShareCurrentButton from "$components/ShareCurrentButton.svelte";
	import { identity } from "$lib/store";
	import { get } from "svelte/store";
</script>

<div
	class="flex flex-row gap-8 justify-between items-center w-screen border-t-gray-700 border-t-2 p-2">
	<div class="flex flex-row">
		{#if $identity?.user?.profile_image}
			<img src={$identity?.user?.profile_image} class="w-10 h-10 rounded-full ml-1" alt="Your account" />
		{:else}
			<svg
				class="w-10 h-10 p-2 ml-1"
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="24"
				height="24"
				viewBox="0,0,255.99544,255.99544"
				style="fill:#000000;">
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
							d="M12,2c-5.523,0 -10,4.477 -10,10c0,5.523 4.477,10 10,10c5.523,0 10,-4.477 10,-10c0,-5.523 -4.477,-10 -10,-10zM12,4.75c1.795,0 3.25,1.455 3.25,3.25c0,1.795 -1.455,3.25 -3.25,3.25c-1.795,0 -3.25,-1.455 -3.25,-3.25c0,-1.795 1.455,-3.25 3.25,-3.25zM12,20c-2.438,0 -4.621,-1.091 -6.088,-2.812c-0.381,-0.447 -0.296,-1.118 0.173,-1.471c1.517,-1.141 4.281,-1.717 5.915,-1.717c1.634,0 4.398,0.576 5.916,1.717c0.469,0.353 0.554,1.025 0.173,1.471c-1.468,1.721 -3.651,2.812 -6.089,2.812z" /></g
					></g>
			</svg>
		{/if}
		<svg
			class="w-10 h-10 p-2 ml-1"
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="24"
			height="24"
			viewBox="0,0,255.99544,255.99544"
			style="fill:#000000;">
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
						d="M9,2c-3.85415,0 -7,3.14585 -7,7c0,3.85415 3.14585,7 7,7c1.748,0 3.34501,-0.65198 4.57422,-1.71875l0.42578,0.42578v1.29297l5.58594,5.58594c0.552,0.552 1.448,0.552 2,0c0.552,-0.552 0.552,-1.448 0,-2l-5.58594,-5.58594h-1.29297l-0.42578,-0.42578c1.06677,-1.22921 1.71875,-2.82622 1.71875,-4.57422c0,-3.85415 -3.14585,-7 -7,-7zM9,4c2.77327,0 5,2.22673 5,5c0,2.77327 -2.22673,5 -5,5c-2.77327,0 -5,-2.22673 -5,-5c0,-2.77327 2.22673,-5 5,-5z" /></g
				></g>
		</svg>
	</div>
	<ShareCurrentButton />
</div>
