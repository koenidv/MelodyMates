<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { identity } from "$lib/store";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import { get } from "svelte/store";

	createGraphClient();

	const me = queryStore({
		client: getContextClient(),
		query: gql`
			query ($userId: String!) {
				userById(id: $userId) {
					id
					profile_name
					profile_image
					spotify_url
					private {
						follows {
							id
							profile_name
							profile_image
						}
						profile_song {
							id
							name
							album {
								id
								name
								cover_image
								theme_color
							}
							artists {
								data {
									id
									name
								}
							}
							preview_url
						}
					}
				}
			}
		`,
		variables: {
			userId: get(identity).user.id
		}
	});
</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $me.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $me.error}
		<p>Oh no... {$me.error.message}</p>
	{:else}
		<img src={$me.data.userById.profile_image} alt="Profile" class="w-16 h-16 rounded-full" />
		<h1 class="text-xl">
			{$me.data.userById.profile_name}
		</h1>
        <p>
            {$me.data.userById.private.follows.length} friends
        </p>
	{/if}
</div>
