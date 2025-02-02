import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Invoice from "./components/Invoice";
import CustomOverlay from "../../components/Styled/CustomOverlay";

const ViewSalary = ({ salary_id }) => {
  const [salaryData, setSalaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const salary = await axios.get(`/api/pay/get_salary/${salary_id}`);
      const data = salary.data.result;
      setSalaryData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("View Salary", error);
      toast.error("Error Viewing Salary");
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);
  return (
    <>
      <CustomOverlay open={loading} />
      {/* <Box
        sx={{
          marginTop: "16px",
          padding: "20px",
          margin: "20px",
          border: "1px solid #e8ebee",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        {JSON.stringify(salaryData, null, 2)}
      </Box> */}
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
