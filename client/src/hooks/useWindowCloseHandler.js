import { useEffect } from "react";

const baseUrl =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_DOMAIN_NAME
    : import.meta.env.VITE_BACKEND_LOCAL_ADDRESS;

export const useWindowCloseHandler = (tempFilesRef) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleUnload = () => {
      const url = `${baseUrl}/api/employee/grabage_collector`;
      navigator.sendBeacon(url, JSON.stringify(tempFilesRef.current));
    };

    // Attach event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
};
