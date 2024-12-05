import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";
import {
  useQuery,
} from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import toast from "react-hot-toast";
export default function AllLeaves() {
  const [allLeaves, setAllLeave] = useState([]);


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
  // console.log(query);

  // Handle Loading and Error States
  if (query.isLoading) {
    return <CustomOverlay open={ true} />;
  }

  if (query.isError) {
    toast.error(query.error.message);
    return
  }

  console.log(query);
  return (
    <>
      <LeavesTable allLeaves={query.data || []} />
    </>
  );
}
