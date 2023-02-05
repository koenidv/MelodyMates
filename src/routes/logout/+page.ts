import { browser } from "$app/environment";
const { identity } = await import("$lib/store");
const { redirect } = await import("@sveltejs/kit");

export function load() {
  if (browser) {
    identity.set({
      jwt: undefined,
      spotify: undefined,
      user: undefined,
    });
    throw redirect(307, "/login");
  }
}