import axios from "axios";

export const AXIOS_CLODUDINARY = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dp6skqcvc",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: false,
});

// AXIOS_CLODUDINARY.interceptors.response.use(
//   (response) => {
//     // Custom logic for handling Cloudinary responses
//     return response;
//   },
//   (error) => {
//     // Handle errors specific to Cloudinary API calls
//     console.error("Error in Cloudinary request:", error);
//     return Promise.reject(error); // Propagate the error
//   }
// );
