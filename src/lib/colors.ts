import Vibrant from "node-vibrant";

export async function getSongColor(
  url: string,
  songid?: string,
): Promise<{ hex: string, songid?: string }> {
  const palette = await Vibrant.from(url).getPalette();
  return {
    hex: palette.DarkVibrant?.hex || "#394151",
    songid: songid,
  };
}
