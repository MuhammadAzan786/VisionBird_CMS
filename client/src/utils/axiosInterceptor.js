import axios from "axios";

//Your global default settings
axios.defaults.baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_DOMAIN_NAME
    : import.meta.env.VITE_BACKEND_LOCAL_ADDRESS;
axios.defaults.withCredentials = true;

axios.create();

// Adding the response interceptor globally to check for token expiration
axios.interceptors.response.use(
  (response) => {
    // If the request is successful, just return the response
    return response;
  },
  (error) => {
    console.log(error.response.data.message === "Session expired, please log in again");
    // If the error message indicates session expired
    if (error.response.data.message === "Session expired, please log in again") {
      console.log("im innnn");
      // Token expired, handle the redirection to login
      window.location.href = "/login";
    }
    // If the error is something else, propagate it
    return Promise.reject(error);
  }
);

export default axios;
