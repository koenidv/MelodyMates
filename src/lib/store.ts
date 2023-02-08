import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";
import type { NowPlaying } from "$lib/db";

type Identity = {
  jwt: string | undefined;
  spotify: OAuthed | undefined,
  user: any | undefined;
};

export type OAuthed = {
    access_token: string;
    expires: number;
    refresh_token: string;
}

export const identity = persisted("identity", {} as Identity);
export const currentlyPlaying = persisted("nowplaying", {} as NowPlaying);
