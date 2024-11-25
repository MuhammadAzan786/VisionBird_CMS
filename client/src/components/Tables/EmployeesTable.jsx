import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CustomChip } from "../Styled/CustomChip";
import { WordCaptitalize } from "../../utils/common";
import EmployeeNameCell from "../Grid Cells/EmployeeProfileCell";
import PropTypes from "prop-types";

const EmployeesTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  const fetchEmployees = async () => {
    await axios
      .get(`/api/employee/get_managers_employees?search=${searchTerm}||""`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]);

  const employeeColumns = [
    {
      field: "employeeName",
      headerName: "Employee",
      flex: 1,
      renderCell: ({ row }) => (
        <EmployeeNameCell
          src={row.employeeProImage}
          userId={row.employeeID}
          name={row.employeeName}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "employeeDesignation",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "qualification",
      headerName: "Qualification",
      flex: 1,
    },

    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <CustomChip
          label={WordCaptitalize(params.value)}
          size="small"
          status={params.value}
        />
      ),
    },
  ];

  return (
    <DataGrid
      rows={employees.map((employee) => ({
        ...employee,
        id: employee._id,
      }))}
      columns={employeeColumns}
      onRowDoubleClick={navigateTo}
      pagination
      autoPageSize
      sx={{
        cursor: "pointer",
      }}
      disableRowSelectionOnClick
    />
  );
};

EmployeesTable.propTypes = {
  searchTerm: PropTypes.any,
};

export default EmployeesTable;
