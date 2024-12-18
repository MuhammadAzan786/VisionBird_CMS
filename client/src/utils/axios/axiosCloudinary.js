import axios from "axios";

export const AXIOS_CLODUDINARY = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dp6skqcvc",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: false,
});
