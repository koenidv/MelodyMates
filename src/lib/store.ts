import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";

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

type NowPlaying = {
    song: Song;
    progress_ms: number;
    is_playing: boolean;
    timestamp: number;
};

type Song = {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    duration: number;
    popularity: number;
    type: string;
    preview_url: string;
};

type Artist = {
    id: string;
    name: string;
}

type Album = {
    id: string;
    name: string;
    cover_image: string;
}

export const identity = persisted("identity", {} as Identity);
export const currentlyPlaying = writable({} as NowPlaying);
