import { browser } from "$app/environment";
import { identity } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export async function load() {
  if (browser && !get(identity).jwt) {
      throw redirect(307, "/login");
  }
}
