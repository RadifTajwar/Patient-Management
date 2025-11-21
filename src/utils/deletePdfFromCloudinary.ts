import axios from 'axios';

// Function to delete PDF from Cloudinary using public ID
export const deletePdfFromCloudinary = async (publicId: string): Promise<void> => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dfkixsjk4/resources/image/upload/${publicId}`;

  try {
    // Use Basic Authentication with Cloudinary API Key and API Secret
    const auth = {
      username: 'dfkixsjk4', // Replace with your Cloudinary cloud name
      password: '317612493892783', // Replace with your Cloudinary API secret
    };

    // Send DELETE request with basic auth
    await axios.delete(CLOUDINARY_URL, { auth });

    (`File with public ID ${publicId} deleted from Cloudinary`);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('File deletion failed');
  }
};
