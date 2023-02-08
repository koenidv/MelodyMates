import { createClient, setContextClient } from "@urql/svelte";
import { identity } from "$lib/store";
import { get } from "svelte/store";
import { getContext, setContext } from "svelte";

export function createGraphClient() {
  if (getContext("graphClientCreated")) return;
  const client = createClient({
    url: "https://graphql.eu.fauna.com/graphql",
    fetchOptions: () => {
      const token = get(identity).jwt;
      return {
        headers: { Authorization: `Bearer ${token}` },
      };
    },
  });
  setContextClient(client);
  setContext("graphClientCreated", true);
}
