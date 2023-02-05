import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";

type Identity = {
  jwt: string | undefined;
  spotify: OAuthed | undefined,
  user: any | undefined;
};

}


export const identity = persisted("identity", {} as Identity);
