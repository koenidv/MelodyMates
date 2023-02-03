<script lang="ts">
    import { currentlyPlaying } from "$lib/store"
</script>

<button class="bg-gray-700 rounded-xl p-3 disabled:bg-gray-900 disabled:text-gray-500">
    { $currentlyPlaying?.name || "Nothing playing" }
</button>