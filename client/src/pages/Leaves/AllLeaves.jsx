import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../../redux/socketSlice";
export default function AllLeaves() {
  const [allLeaves, setAllLeave] = useState([]);

  const socket = useSelector((state) => state.socket.socket);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Fetch All Leaves
  const query = useQuery({
    queryKey: ["All leaves"],
    queryFn: async () => {
      const response = await axios.get(`/api/leave/all-leaves`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        queryClient.invalidateQueries("All leaves");
      });
      return () => {
        socket.off("notification", () => {});
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);

  if (query.isLoading) {
    return <CustomOverlay open={true} />;
  }

  if (query.isError) {
    toast.error(query.error.message);
    return;
  }

  console.log(query);
  return (
    <>
      <LeavesTable allLeaves={query.data || []} />
    </>
  );
}
