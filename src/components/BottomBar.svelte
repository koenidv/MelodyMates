<script lang="ts">
	import ShareCurrentButton from "$components/ShareCurrentButton.svelte";
	import { identity } from "$lib/store";
</script>

<div class="fixed bottom-0 left-0 w-screen">
	<div
		class="flex flex-row gap-8 justify-between items-center w-screen max-w-screen-md mx-auto p-2 pt-0 flex-1 min-w-0 bg-black shadow-bottombar">
		<div class="flex flex-row shrink-0">
			<a href="/me">
				{#if $identity?.user?.profile_image}
					<img
						src={$identity?.user?.profile_image}
						class="w-10 h-10 rounded-full ml-1"
						alt="Your account" />
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
			</a>
			<a href="/me/requests">
				<svg
					class="fill-white w-10 h-10 p-2 ml-2"
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="100"
					height="100"
					viewBox="0 0 24 24">
					<path
						d="M 13.992188 4.0097656 C 13.548523 4.0137856 13.106733 4.1107825 12.695312 4.3007812 L 11.160156 5.0097656 A 1.0001 1.0001 0 0 0 11 5 L 2 5 L 2 15 L 3 15 L 9.0761719 20.316406 C 9.5743021 20.753058 10.215683 20.992187 10.876953 20.992188 C 11.600572 20.992186 12.297789 20.702211 12.808594 20.191406 L 12.810547 20.191406 L 15.990234 17 A 1.0001 1.0001 0 0 0 16 17 L 23 17 L 23 4.6132812 L 19.048828 5.9296875 L 15.294922 4.2773438 C 14.879888 4.0946705 14.43585 4.0057464 13.992188 4.0097656 z M 14.009766 6.0097656 C 14.172887 6.0079923 14.337268 6.0400973 14.490234 6.1074219 L 18.951172 8.0703125 L 21 7.3886719 L 21 15 L 17.982422 15 L 18.171875 14.810547 C 19.303296 13.676038 19.235751 11.784187 18.029297 10.730469 L 14.207031 7.3925781 L 10.978516 8.5703125 L 10.976562 8.5703125 C 10.522439 8.7358694 10.035496 8.5444151 9.8125 8.1152344 L 9.6953125 7.890625 L 13.533203 6.1171875 C 13.684783 6.0471864 13.846644 6.011539 14.009766 6.0097656 z M 4 7 L 6.9785156 7 L 8.0371094 9.0371094 C 8.7161134 10.343929 10.278279 10.953662 11.662109 10.449219 L 13.78125 9.6757812 L 16.714844 12.236328 C 17.07239 12.54861 17.090433 13.062945 16.755859 13.398438 L 16.753906 13.398438 L 11.394531 18.777344 C 11.251336 18.920539 11.079334 18.992188 10.876953 18.992188 C 10.698223 18.992188 10.528401 18.929848 10.394531 18.8125 L 4 13.216797 L 4 7 z" />
				</svg>
			</a>
			<a href="/search">
				<svg
					class="w-10 h-10 p-2 ml-2"
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
			</a>
		</div>
		<ShareCurrentButton />
	</div>
</div>
