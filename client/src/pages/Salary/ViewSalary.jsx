import { Box, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Invoice from "./components/Invoice";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import { usePDF } from "react-to-pdf";
import { Stack } from "rsuite";
import { useParams } from "react-router-dom";

const ViewSalary = () => {
  const { salaryId } = useParams();
  const [salaryData, setSalaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "Salary.pdf" });
  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const salary = await axios.get(`/api/pay/get_salary/${salaryId}`);
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

      <Box>
        <Box marginBottom={2} display={"flex"} justifyContent={"right"}>
          <Button
            variant="contained"
            onClick={() => {
              toPDF();
            }}
          >
            Download Slip
          </Button>
        </Box>
        <Invoice {...salaryData} ref={targetRef} />
      </Box>
    </>
  );
};

export default ViewSalary;
