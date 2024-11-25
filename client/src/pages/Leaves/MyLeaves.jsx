import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import { useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";

export default function MyLeaves() {
  const [allLeaves, setAllLeaves] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;

  useEffect(() => {
    axios
      .get(`/api/leave/my-leaves/${id}`)
      .then((response) => {
        setAllLeaves(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave history:", error);
      });
  }, [id]);

  return (
    <>
      <LeavesTable allLeaves={allLeaves} />
    </>
  );
}
