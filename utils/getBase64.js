import { getPlaiceholder } from "plaiceholder";

async function getBase64(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Failed`);
    }
    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (e) {
    console.log(e);
  }
}

export default getBase64;
