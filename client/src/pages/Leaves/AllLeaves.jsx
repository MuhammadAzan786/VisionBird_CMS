// import { useEffect, useState } from "react";
// import axios from "../../utils/axiosInterceptor";
// import LeavesTable from "./leavesTable/LeavesTable";

// export default function AllLeaves() {
//   const [allLeaves, setAllLeave] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`/api/leave/all-leaves`, {
//         withCredentials: true,
//       })
//       .then((response) => {
//         setAllLeave(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave history:", error);
//       });
//   }, []);

//   return (
//     <>
//       <LeavesTable allLeaves={allLeaves} />
//     </>
//   );
// }




import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import LeavesTable from "./leavesTable/LeavesTable";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
export default function AllLeaves() {
  const [allLeaves, setAllLeave] = useState([]);

  // Access the client
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
  console.log(query);

  // Handle Loading and Error States
  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }
  // useEffect(() => {

  // }, []);
  console.log(query);
  return (
    <>
      <LeavesTable allLeaves={query.data || []} />
    </>
  );
}
