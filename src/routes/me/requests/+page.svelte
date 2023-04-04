<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";

	createGraphClient();

	const requests = queryStore({
		client: getContextClient(),
		query: gql`
			query {
				allFollowRequests {
					data {
						_id
						from {
							id
							profile_name
							profile_image
						}
						recipient {
							id
							profile_name
							profile_image
						}
					}
				}
			}
		`
	});

</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $requests.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $requests.error}
		<p>Oh no... {$requests.error.message}</p>
	{:else}
    <ul>
		{#each $requests.data.allFollowRequests.data as r}
            <li>{JSON.stringify($requests.data)}</li>
        {/each}
    </ul>
	{/if}
</div>
