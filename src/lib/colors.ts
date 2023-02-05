import Vibrant from "node-vibrant";

export async function getSongColor(url: string) {
  console.log(url)
  const palette = await Vibrant.from(url).getPalette();
  console.log(palette)
  return palette.DarkVibrant.hex;
}
