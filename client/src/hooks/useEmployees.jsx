import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEmployees = async ({ queryKey }) => {
  const [, searchTerm] = queryKey;
  const response = await axios.get(
    `/api/employee/get_active_employees?search=${searchTerm || ""}`
  );
  return response.data;
};

const useEmployees = ({ searchTerm }) => {
  return useQuery({
    queryKey: ["activeEmployees", searchTerm],
    queryFn: fetchEmployees,
    enabled: true,
  });
};

export default useEmployees;
