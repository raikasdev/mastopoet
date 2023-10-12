export default async function bufferToBase64(
  buffer: Uint8Array,
): Promise<string> {
  // use a FileReader to generate a base64 data URI:
  const base64url: string = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as string);
    reader.readAsDataURL(new Blob([buffer]));
  });
  // remove the `data:...;base64,` part from the start
  return base64url.slice(base64url.indexOf(",") + 1);
}
