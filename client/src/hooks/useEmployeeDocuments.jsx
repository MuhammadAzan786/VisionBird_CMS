import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEmployeeDocuments = async (employeeId) => {
  if (!employeeId) return [];
  const { data } = await axios.get(
    `/api/employee-documents/employee/${employeeId}`
  );
  return data;
};

const useEmployeeDocuments = (employeeId) => {
  return useQuery({
    queryKey: ["employeeDocuments", employeeId], // Cache key
    queryFn: () => fetchEmployeeDocuments(employeeId), // Fetch function
    enabled: !!employeeId, // Only fetch if employeeId is available
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export default useEmployeeDocuments;
