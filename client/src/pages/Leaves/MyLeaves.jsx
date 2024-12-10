// import { useState, useEffect } from "react";
// import axios from "../../utils/axiosInterceptor";
// import { useSelector } from "react-redux";
// import LeavesTable from "./leavesTable/LeavesTable";

// export default function MyLeaves() {
//   const [allLeaves, setAllLeaves] = useState([]);
//   const { currentUser } = useSelector((state) => state.user);
//   const id = currentUser._id;

//   useEffect(() => {
//     axios
//       .get(`/api/leave/my-leaves/${id}`)
//       .then((response) => {
//         setAllLeaves(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave history:", error);
//       });
//   }, [id]);

//   return (
//     <>
//       <LeavesTable allLeaves={allLeaves} />
//     </>
//   );
// }

import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import { useDispatch, useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import LeavesTable from "./leavesTable/LeavesTable";
import { initializeSocket } from "../../redux/socketSlice";

export default function MyLeaves() {
  const [allLeaves, setAllLeaves] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;
 const socket = useSelector((state) => state.socket.socket);
  const dispatch=useDispatch()
  const getLeaves = () =>{
     axios
       .get(`/api/leave/my-leaves/${id}`)
       .then((response) => {
         setAllLeaves(response.data);
       })
       .catch((error) => {
         console.error("Error fetching leave history:", error);
       });
  }
  useEffect(() => {
   getLeaves()
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on("notification", (data) => {
       getLeaves()
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
      <LeavesTable allLeaves={allLeaves} />
    </>
  );
}
