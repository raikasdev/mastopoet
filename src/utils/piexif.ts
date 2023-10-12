import { insert, dump, ImageIFD } from "piexifjs";

export default function addExif(
  jpegDataString: string,
  altText: string,
): string {
  return insert(
    dump({
      "0th": {
        // 0th = image metadata
        [ImageIFD.ImageDescription]: altText,
        [ImageIFD.Software]: "Mastopoet",
      },
    }), // ImageDescription = 10E = 270
    jpegDataString,
  );
}
