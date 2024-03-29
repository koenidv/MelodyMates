<script lang="ts">
	import { identity } from "$lib/store";
	import { getContextClient, gql, mutationStore } from "@urql/svelte";
	import debounce from "lodash/debounce";
	import PostContentBasic from "./PostContentBasic.svelte";
	import { src_url_equal } from "svelte/internal";
	import { getRefIdForUserId } from "$lib/db";

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

	const handleSendReply = async () => {
		const refid = await getRefIdForUserId($identity.user.id);
		const result = mutationStore({
			client: contextClient,
			query: gql`
					mutation {
						createReply(data: {
							post: { connect: "${post.ref}" },
							author: { connect: "${refid}" },
							comment: "${commentvalue}"
						}) {
							_id
						}
					}
				`
		});
		commentvalue = "";
	};
</script>

<div class="rounded-lg mb-2 relative overflow-clip snap-both snap-mandatory snap-center">
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
				<div
					class="flex flex-row w-full rounded-lg text-white placeholder-opacity-75 placeholder-white bg-black bg-opacity-[15%] focus:bg-opacity-30 border"
					style="border-color: {post.song.album.theme_color}">
					<input
						type="text"
						class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-transparent"
						style="border-color: {post.song.album.theme_color}"
						placeholder="Send a reply"
						bind:value={commentvalue}
						on:keypress={(e) => {
							if (e.charCode == 13) handleSendReply();
						}} />
					{#if commentvalue.length > 0}
						<button
							class="rounded-lg px-4 bg-black bg-opacity-0 hover:bg-opacity-30 transition-colors"
							on:click={handleSendReply}>Send</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full flex flex-col overflow-x-scroll gap-2">
		{#each post.replies.data as reply}
			<div
				class="flex flex-col w-full rounded-lg p-4 gap-2 text-white"
				style="background-color: {post.song.album.theme_color}">
				<a href="/user/{post.author.id}" class="flex flex-row items-center gap-1">
					<img
						src={reply.author.profile_image || "/icons/generic_user.svg"}
						alt="Profile"
						class="w-5 h-5 rounded-full shadow-sm object-cover"
						style="background-color: {post.song.album.theme_color}" />
					<p class="opacity-75 text-sm">{reply.author.profile_name.split(" ")[0]}</p>
				</a>
				{reply.comment}
			</div>
		{/each}
	</div>
</div>
