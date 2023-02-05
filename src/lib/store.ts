import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store'

type Identity = {
    jwt: string;
    user: any;
}

export const identity = persisted('identity', {} as Identity);
export const currentlyPlaying = writable(null);