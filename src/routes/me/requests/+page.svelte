<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import { identity } from "$lib/store";

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

	type Request = {
		_id: string;
		from: {
			id: string;
			profile_name: string;
			profile_image: string;
		};
		recipient: {
			id: string;
			profile_name: string;
			profile_image: string;
		};
	};

	const requestsSorted: { outgoing: Request[]; incoming: Request[] } = {
		outgoing: [],
		incoming: []
	};

	function sortRequests() {
		if (!$requests.data) return;
		requestsSorted.outgoing = [];
		requestsSorted.incoming = [];
		$requests.data.allFollowRequests.data.map((r: Request) => {
			if (r.from.id === $identity.user.id) {
				requestsSorted.outgoing.push(r);
			} else {
				requestsSorted.incoming.push(r);
			}
		});
	}

	$: $requests, sortRequests();
</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $requests.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $requests.error}
		<p>Oh no... {$requests.error.message}</p>
	{:else}
		<p class="text-xl">Outgoing</p>
		<ul>
			{#each requestsSorted.outgoing as r}
				<li>{r.from.profile_name}</li>
			{/each}
		</ul>
		<p class="text-xl">Incoming</p>
		<ul>
			{#each requestsSorted.incoming as r}
				<li>{r.from.profile_name}</li>
			{/each}
		</ul>
	{/if}
</div>
