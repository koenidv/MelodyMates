<script lang="ts">
	import { identity } from "$lib/store";
	import { getContextClient, gql, mutationStore } from "@urql/svelte";
	import debounce from "lodash/debounce";
	import PostContentBasic from "./PostContentBasic.svelte";

	export let post: any;
	export let liked: boolean;

	let commentvalue = "";

	const contextClient = getContextClient();

	const handleNoteInput = debounce(async () => {
		const result = mutationStore({
			client: contextClient,
			query: gql`
					mutation {
						partialUpdatePost(id: "${post.ref}", data: {
								note: "${post.note}"  
						}) {
							_id
							note
						}
					}
				`
		});
	}, 800);

	const dummyreplies = [
		{
			author: {
				id: "1",
				profile_name: "John Doe",
				profile_image: "/icons/generic_user.svg"
			},
			comment: "This is a comment"
		},
		{
			author: {
				id: "1",
				profile_name: "John Doe",
				profile_image: "/icons/generic_user.svg"
			},
			comment: "This is a longer comment"
		},
		{
			author: {
				id: "3ukbsbcagr66rfk9yokfd53ak",
				profile_name: "Florian",
				profile_image: "https://i.scdn.co/image/ab6775700000ee8596fb72e0cbed7cc9e52ee785"
			},
			comment:
				"Somebody was motivated to write a whole paragraph as comment, so we're gonna have to make this one a bit longer to make it look like it's not just a copy of the previous one."
		}
	];
</script>

<a href="/post/{post.ref}"
	class="rounded-lg mb-2 relative overflow-clip bg-gray-800 snap-both snap-mandatory snap-center"
	style="background-color: {post.song.album.theme_color}">
	<div class="bg-black bg-opacity-40">
		<div
			style="background-color: {post.song.album.theme_color}"
			class="rounded-lg p-3 mb-2 relative overflow-clip shadow-sm">
			<img
				src={post.song.album.cover_image}
				alt=""
				class="absolute top-0 left-0 opacity-25 h-full w-full object-cover blur-md" />
			<div class="relative flex flex-col gap-2">
				<!-- Author -->
				<a href="/user/{post.author.id}" class="flex flex-row items-center gap-1">
					<img
						src={post.author.profile_image || "/icons/generic_user.svg"}
						alt="Profile"
						class="w-5 h-5 rounded-full shadow-sm object-cover"
						style="background-color: {post.song.album.theme_color}" />
					<p class="opacity-75 text-sm">{post.author.profile_name.split(" ")[0]}</p>
				</a>
				<!-- Content -->
				<PostContentBasic {post} {liked} />
				<!-- Notes / Comments -->
				{#if post.author.id === $identity.user.id}
					<input
						type="text"
						class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-black bg-opacity-[15%] focus:bg-opacity-30 border"
						style="border-color: {post.song.album.theme_color}"
						placeholder="Leave a note"
						maxlength="100"
						bind:value={post.note}
						on:input={() => handleNoteInput()} />
				{:else if post.note}
					<p class="text-white opacity-75">{post.note}</p>
				{/if}
				{#if post.author.id !== $identity.user.id || post.note}
					<input
						type="text"
						class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-black bg-opacity-[15%] focus:bg-opacity-30 border"
						style="border-color: {post.song.album.theme_color}"
						placeholder="Send a reply"
						bind:value={commentvalue} />
				{/if}
			</div>
		</div>

		<div class="w-full flex flex-row overflow-x-scroll gap-2 px-2 pb-2">
			{#each dummyreplies as reply}
			<div class="w-60 min-w-[15rem] rounded-lg p-2 text-white"
			style="background-color: {post.song.album.theme_color}">
				{reply.comment}
			</div>
			{/each}
		</div>
	</div>
</a>
