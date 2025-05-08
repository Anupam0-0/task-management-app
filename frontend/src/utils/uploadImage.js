import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("file", image);
        // formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset later
    
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });
    
        return response.data; //return respons data
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error; //for error handling in the calling function
    }
}

export default uploadImage;