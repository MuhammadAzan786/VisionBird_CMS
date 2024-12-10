import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useDispatch, useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";
import { initializeSocket } from "../../redux/socketSlice";

export default function EmployeeLeaves() {
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const[employeePendingLeaves,setEmployeePendingLeaves]=useState([])
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();

  const getEmployeeLeaves = () => {
    axios
      .get(`/api/leave/employee-leaves/${id}`)
      .then((response) => {
        setEmployeeLeaves(response.data);
        const pending = response.data.filter((item) => {
          return item.state=='Pending'
        })
        setEmployeePendingLeaves(pending);
      })
      .catch((error) => {
        console.error("Error fetching Employee leave history:", error);
      });
  };

  useEffect(() => {
    // axios
    //   .get(`/api/leave/employee-leaves/${id}`, {
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     setEmployeeLeaves(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching leave history:", error);
    //   });

    getEmployeeLeaves();
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on("notification", (data) => {
        getEmployeeLeaves();
      });
      return () => {
        socket.off("notification", (data) => {
          // console.log(`Employee of the Week: ${data.employee} with ${data.points} points!`);
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
