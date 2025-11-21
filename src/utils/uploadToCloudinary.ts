import axios from "axios";

export const uploadToCloudinary = async (
  pdfBlob: Blob,
  folderPath: string
): Promise<string> => {
  // Format current date (YYYY-MM-DD)
  const now = new Date();
  const formattedDate = now.toISOString()?.split("T")[0]; // e.g. "2025-09-01"

  const formData = new FormData();
  formData.append("file", pdfBlob, formattedDate + ".pdf"); // ✅ file has a date-based name
  formData.append("folder", folderPath);
  formData.append("upload_preset", "Doctor_preset_unsigned");
  formData.append("resource_type", "auto");
  formData.append("public_id", formattedDate); // ✅ public_id = date only

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfkixsjk4/upload";

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.secure_url;
  } catch (error: any) {
    console.error(
      "Error uploading PDF to Cloudinary:",
      error.response?.data || error
    );
    throw new Error("Upload failed");
  }
};
