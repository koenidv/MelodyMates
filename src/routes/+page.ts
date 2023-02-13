// since there's no dynamic data here, we can prerender

import { browser } from "$app/environment";
import { identity } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

// it so that it gets served as a static asset in production
export const prerender = true;

export function load() {
  if (browser && get(identity).jwt) {
    throw redirect(307, "/home");
  } else {
    throw redirect(307, "/login");
  }
}
