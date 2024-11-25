import toast from "react-hot-toast";

export const CheckAxiosError = (error, customMsg = "") => {
  if (error.response && error.response.data && error.response.data.msg) {
    toast.error(error.response.data.msg, { duration: 2000 });
  } else {
    toast.error(customMsg, {
      duration: 2000,
    });
    console.log(error);
  }
};
