import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";
import { useQuery } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import toast from "react-hot-toast";
export default function AllLeaves({ table }) {
  const [allLeaves, setAllLeave] = useState([]);

  // Fetch All Leaves
  const query = useQuery({
    queryKey: ["All leaves"],
    queryFn: async () => {
      const response = await axios.get(`/api/leave/all-leaves`);
      return response.data;
    },
  });
  // console.log(query);

  // Handle Loading and Error States
  if (query.isLoading) {
    return <CustomOverlay open={true} />;
  }

  if (query.isError) {
    toast.error(query.error.message);
    return;
  }

  console.log("query res", query.data);

  const ManagerPendingLeaves = query.data.filter((item) => {
    return item.status === "Pending" && item.from.role === "manager";
  });
  console.log("mannn", ManagerPendingLeaves);
  const MannagerAllLeave = query.data.filter((item) => {
    return item.from.role === "manager";
  });
  const employeePendingLeaves = query.data.filter((item) => {
    return item.status === "Pending" && item.from.role === "employee";
  });
  const employeeAllLeave = query.data.filter((item) => {
    return item.from.role === "employee";
  });
  console.log("table", table)
  console.log("all lever of emp", employeeAllLeave);
  
  console.log("all lever of man", ManagerPendingLeaves, );
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
