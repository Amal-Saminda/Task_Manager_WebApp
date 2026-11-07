import { API_PATHS } from "./apipaths";
import axiosInstance from './axiosinstance';

export const uploadImage = async (imageFile) => {

  const formData = new FormData();

  //Append image file to form data

  formData.append('image' , imageFile);

  try{
    const response= await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', //set header for upload
      },
    });
    return response.data; //retrun response data
  }
  catch(error){
    console.log("Error Uploading the image:",error);
    throw error; //rethrow error for heading
  }
}