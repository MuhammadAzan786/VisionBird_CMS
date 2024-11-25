import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";

export default function AllLeaves() {
  const [allLeaves, setAllLeave] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/leave/all-leaves`, {
        withCredentials: true,
      })
      .then((response) => {
        setAllLeave(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave history:", error);
      });
  }, []);

  return (
    <>
      <LeavesTable allLeaves={allLeaves} />
    </>
  );
}
