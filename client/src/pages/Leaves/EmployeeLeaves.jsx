import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";

export default function EmployeeLeaves() {
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;

  useEffect(() => {
    axios
      .get(`/api/leave/employee-leaves/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setEmployeeLeaves(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave history:", error);
      });
  }, [id]);

  return (
    <>
      <LeavesTable allLeaves={employeeLeaves} />
    </>
  );
}
