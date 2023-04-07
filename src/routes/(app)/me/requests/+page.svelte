<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, mutationStore, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import { identity } from "$lib/store";
	import IncomingRequest from "$components/requests/incoming.svelte";
	import CloseButton from "$components/CloseButton.svelte";

	createGraphClient();
	const contextClient = getContextClient();

	const requests = queryStore({
		client: contextClient,
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

	function deleteRequest(request: Request) {
		const result = mutationStore({
			client: contextClient,
			query: gql`
					mutation {
						deleteFollowRequest(id: "${request._id}") {
							_id
						}
					}
				`
		});
	}

	function acceptRequest(request: Request) {
		const result = mutationStore({
			client: contextClient,
			query: gql`
					mutation {
						acceptFollowRequest(ref: "${request._id}") {
							_id
						}
					}
				`
		});
	}
</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8 relative">
	{#if $requests.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $requests.error}
		<p>Oh no... {$requests.error.message}</p>
	{:else}
		<CloseButton />
		<p class="text-xl">Outgoing</p>
		<div class="rounded-lg bg-gray-900 w-full py-2">
			{#each requestsSorted.outgoing as r}
				<div class="px-4 py-2 flex flex-row items-center gap-3">
					<img
						src={r.recipient.profile_image || "/icons/generic_user.svg"}
						alt="Profile"
						class="w-6 h-6 rounded-full bg-gray-800" />
					<a href="/user/{r.recipient.id}" class="grow">
						<p class="text-md">{r.recipient.profile_name}</p>
					</a>
					<button class="opacity-60" on:click={() => deleteRequest(r)}>Cancel</button>
				</div>
			{/each}
		</div>
		<p class="text-xl">Incoming</p>
		<div class="w-full">
			{#each requestsSorted.incoming as r}
				<IncomingRequest request={r} />
			{/each}
		</div>
	{/if}
</div>
