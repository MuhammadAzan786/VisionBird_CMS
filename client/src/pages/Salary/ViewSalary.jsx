import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Invoice from "./components/Invoice";

const ViewSalary = ({ salary_id }) => {
  const [salaryData, setSalaryData] = useState({});
  const fetchSalaryData = async () => {
    try {
      const salary = await axios.get(`/api/pay/get_salary/${salary_id}`);
      const data = salary.data.result;
      setSalaryData(data);
      toast.success(JSON.stringify(data));
    } catch (error) {
      console.log("View Salary", error);
      toast.error("Error Viewing Salary");
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);
  return (
    <>
      <Box
        sx={{
          marginTop: "16px",
          padding: "20px",
          margin: "20px",
          border: "1px solid #e8ebee",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        {JSON.stringify(salaryData)}
      </Box>
      <Box
        sx={{
          marginTop: "16px",
          padding: "20px",
          margin: "20px",
          border: "1px solid #e8ebee",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <Invoice salaryData={salaryData} />
      </Box>
    </>
  );
};

export default ViewSalary;
