import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useDispatch, useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";
import { initializeSocket } from "../../redux/socketSlice";

export default function EmployeeLeaves() {
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [employeePendingLeaves, setEmployeePendingLeaves] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;
  console.log("currentUser", currentUser);
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const getLeaves = () => {
    axios
      .get(`/api/leave/employee-leaves/${id}`)
      .then((response) => {
        setEmployeeLeaves(response.data);
        const pending = response.data.filter((item) => {
          // console.log("statuss", item.status);
          return item.status == "Pending";
        });
        // console.log("pendinggggggggg", pending);
        setEmployeePendingLeaves(pending);
      })
      .catch((error) => {
        console.error("Error fetching Employee leave history:", error);
      });
  };
  useEffect(() => {
    getLeaves();
  }, [id]);
  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        getLeaves();
      });
      socket.on("leaveStatusChanges", () => {
        getLeaves();
      });
      return () => {
        socket.off("notification", () => {
          // console.log(`Employee of the Week: ${data.employee} with ${data.points} points!`);
        });

        socket.off("leaveStatusChanges", () => {
          getLeaves();
        });
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);
  return (
    <>
      <>
        {/* <LeavesTable allLeaves={allLeaves} /> */}
        <LeavesTable
          allLeaves={employeeLeaves || []}
          pendingLeaves={employeePendingLeaves || []}
        />
      </>
      {/* <LeavesTable allLeaves={employeeLeaves} /> */}
    </>
  );
}
