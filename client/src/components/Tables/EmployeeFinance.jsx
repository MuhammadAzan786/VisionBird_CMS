import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "../../utils/axiosInterceptor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

export default function EmployeeFinance() {
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  const handleDateChange = (newDate) => {
    const selectedYear = dayjs(newDate).format("YYYY");
    setSelectedYear(selectedYear);
    console.log(selectedYear);
  };

  const navigateTo = (id) => {
    navigate("/all-portfolio");
    console.log(id);
  };

  const fetchEmployees = async () => {
    await axios
      .get("/api/employee/all_employees")
      .then((response) => {
        console.log(response.data);
        const filteredEmployees = response.data.map((employee) => ({
          employeeProImage: employee.employeeProImage.secure_url,
          employeeID: employee.employeeID,
          employeeName: employee.employeeName,
          employeeFatherName: employee.employeeFatherName,
          _id: employee._id,
        }));
        setEmployee(filteredEmployees);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const EmpSalaryColumn = [
    {
      field: "employeeProImage",
      headerName: "Profile Pic",
      width: 100,
      renderCell: (params) => <Avatar alt="Avatar" src={params.row.employeeProImage.secure_url} />,
    },
    {
      field: "employeeID",
      headerName: "ID",
      width: 250,
    },
    {
      field: "employeeName",
      headerName: "Name",
      width: 250,
    },
    {
      field: "employeeFatherName",
      headerName: "FatherName",
      width: 250,
    },
  ];

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Year" views={["year"]} openTo="year" onChange={handleDateChange} />
        </LocalizationProvider>
        {/* <Typography>{selectedYear}</Typography> */}
      </Box>
      <Box sx={{ height: 550 }} mt={2}>
        <DataGrid
          rows={employee.map((emp) => ({
            ...emp,
            id: emp._id,
          }))}
          columns={EmpSalaryColumn}
          onRowDoubleClick={(row) => navigateTo(row.id)}
          slots={{ toolbar: GridToolbar }}
          sx={{ cursor: "pointer", userSelect: "none" }}
        />
      </Box>
    </Box>
  );
}
