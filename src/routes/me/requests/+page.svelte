<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, mutationStore, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import { identity } from "$lib/store";
	import { onMount } from "svelte";

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

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $requests.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $requests.error}
		<p>Oh no... {$requests.error.message}</p>
	{:else}
		<p class="text-xl">Outgoing</p>
		<div class="rounded-lg bg-gray-900 w-full py-2">
			{#each requestsSorted.outgoing as r}
				<div class="px-4 py-2 flex flex-row items-center gap-3">
					<img
						src={r.recipient.profile_image || "/icons/generic_user.svg"}
						alt="Profile"
						class="w-6 h-6 rounded-full bg-gray-800" />
					<p class="text-md grow">{r.recipient.profile_name}</p>
					<button class="opacity-60" on:click={() => deleteRequest(r)}>Cancel</button>
				</div>
			{/each}
		</div>
		<p class="text-xl">Incoming</p>
		<div class="w-full">
			{#each requestsSorted.incoming as r}
				<div class="rounded-lg bg-gray-900 w-full mb-2 p-4 flex flex-row items-center gap-3">
					<img
						src={r.from.profile_image || "/icons/generic_user.svg"}
						alt="Profile"
						class="w-6 h-6 rounded-full bg-gray-800" />
					<p class="text-md grow">{r.from.profile_name}</p>
					<button class="bg-spotify rounded-full h-8 px-4" on:click={() => acceptRequest(r)}>Accept</button>
					<button
						class="bg-red-800 rounded-full h-8 w-8 flex items-center justify-center"
						on:click={() => deleteRequest(r)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							viewBox="0 0 26 26"
							class="fill-white w-5 h-5">
							<path
								d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
