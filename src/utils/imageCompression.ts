import imageCompression from "browser-image-compression";

export interface NamedFile {
  name: string;
  file: File;
}

/**
 * Compress images safely — ensures each item is a real File instance.
 */
const compressImages = async (files: NamedFile[]): Promise<NamedFile[]> => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedImages = await Promise.all(
      files.map(async (f) => {
        let imageFile = f.file;

        // 🧩 Ensure it's a real File, not some Blob-like object
        if (!(imageFile instanceof File || imageFile instanceof Blob)) {
          console.warn(`⚠️ ${f.name} is not a File — coercing it into one.`);
          imageFile = new File([f.file], f.name, { type: "image/jpeg" });
        }

        console.log(
          `📸 Original: ${f.name} (${(imageFile.size / 1024 / 1024).toFixed(
            2
          )} MB)`
        );

        const compressedFile = await imageCompression(imageFile, options);

        console.log(
          `✅ Compressed: ${f.name} (${(
            compressedFile.size /
            1024 /
            1024
          ).toFixed(2)} MB)`
        );

        return { name: f.name, file: compressedFile };
      })
    );

    return compressedImages;
  } catch (error) {
    console.error("❌ Error compressing images:", error);
    throw error;
  }
};

export default compressImages;
