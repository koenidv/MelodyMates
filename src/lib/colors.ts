import Vibrant from "node-vibrant";

export async function getSongColor(url: string) {
  const palette = await Vibrant.from(url).getPalette();
  return palette.DarkVibrant.hex;
}
