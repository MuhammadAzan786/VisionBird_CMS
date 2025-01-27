import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../../redux/socketSlice";

export default function AllLeaves({ table }) {
  const socket = useSelector((state) => state.socket.socket);
  const currentUser = useSelector((state) => state.user);
  const quryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        quryClient.invalidateQueries("All leaves");
      });
      socket.on("leaveStatusChanges", () => {
        quryClient.invalidateQueries("All leaves");
      });
      socket.on("leaveSent", () => {
        quryClient.invalidateQueries("All leaves");
      });

      return () => {
        socket.off("notification", () => {});
        socket.off("leaveStatusChanges", () => {});
        socket.off("leaveSent", () => {
          quryClient.invalidateQueries("All leaves");
        });
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);
  // Fetch All Leaves
  const query = useQuery({
    queryKey: ["All leaves"],
    queryFn: async () => {
      const response = await axios.get(`/api/leave/all-leaves`);
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

  const ManagerPendingLeaves = query.data.filter((item) => {
    return item.status === "Pending" && item.from?.role === "manager";
  });

  const MannagerAllLeave = query.data.filter((item) => {
    return item.from?.role === "manager";
  });

  const employeePendingLeaves = query.data.filter((item) => {
    return item.status === "Pending" && item.from?.role === "employee";
  });

  const employeeAllLeave = query.data.filter((item) => {
    return item.from?.role === "employee";
  });

  return (
    <>
      <LeavesTable
        allLeaves={
          table == "Employee-leavesHistory"
            ? employeeAllLeave
            : MannagerAllLeave || []
        }
        pendingLeaves={
          table == "Employee-leavesHistory"
            ? employeePendingLeaves
            : ManagerPendingLeaves || []
        }
      />
    </>
  );
}
