import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import { useDispatch, useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";
import { initializeSocket } from "../../redux/socketSlice";

export default function MyLeaves() {
  const [allLeaves, setAllLeaves] = useState([]);
  const [employeePendingLeaves, setEmployeePendingLeaves] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const getLeaves = () => {
    axios
      .get(`/api/leave/my-all-leaves/${id}`)
      .then((response) => {
        setAllLeaves(response.data);
        const pending = response.data.filter((item) => {
          // console.log("statuss", item.status);
          return item.status == "Pending";
        });
        // console.log("pendinggggggggg", pending);
        setEmployeePendingLeaves(pending);
      })
      .catch((error) => {
        console.error("Error fetching leave history:", error);
      });
  };
  useEffect(() => {
    getLeaves();
  }, [id]);

  console.log("myy all", allLeaves);
  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        getLeaves();
      });
      socket.on("leaveSent", () => {
        getLeaves();
      });

      return () => {
        socket.off("notification", () => {
          // console.log(`Employee of the Week: ${data.employee} with ${data.points} points!`);
        });
        socket.off("leaveSent", () => {
          getLeaves();
        });
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);

  return (
    <>
      <LeavesTable allLeaves={allLeaves || []} pendingLeaves={employeePendingLeaves || []} />
    </>
  );
}
