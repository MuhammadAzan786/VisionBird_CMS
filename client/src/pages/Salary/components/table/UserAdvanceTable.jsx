/* eslint-disable react/prop-types */
import { Cancel, CheckCircle, Circle, Pending } from "@mui/icons-material";
import { chipClasses } from "@mui/material";
import axios from "../../../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WordCaptitalize } from "../../../../utils/common";
import { CustomChip } from "../../../../components/Styled/CustomChip";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeNameCell from "../../../../components/Grid Cells/EmployeeProfileCell";

const colStyle = {
  headerAlign: "center",
  align: "center",
};

const UserAdvanceTable = ({ advanceStatus }) => {
  console.log("rendered user sallary");
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axios.post(`/api/advance_payments/user/applications/${currentUser._id}`);
      const applications = res.data;
      const filteredApplications = applications.filter((application) => {
        if (advanceStatus === "all") {
          return application;
        } else if (advanceStatus === "pending") {
          return application.activityStatus === "pending";
        } else {
          return application.activityStatus === "active";
        }
      });
      return filteredApplications;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications().then((res) => {
      const advance_applications = res.map((item) => {
        return {
          ...item,
          id: item._id,
        };
      });
      setRows(advance_applications);
    });
  }, []);

  const columns = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 300,
      renderCell: ({ row }) => (
        <EmployeeNameCell src={row.employeeProImage?.secure_url} userId={row.employeeID} name={row.employeeName} />
      ),
    },
    {
      field: "grossSalary",
      headerName: "Gross Salary",
      width: 250,
    },
    {
      field: "loanAmount",
      headerName: "Loan Amount",
      width: 180,
      ...colStyle,
    },
    {
      field: "repaymentMethod",
      headerName: "Repayment Method",
      width: 180,
      ...colStyle,
      cellClassName: "text-red-500 font-medium",
    },
    {
      field: "numberOfInstallments",
      headerName: "Number Of Installments",
      width: 250,
      ...colStyle,
      renderCell: (params) => (params.value ? params.value : "None"),
    },

    {
      field: "amountPerInstallment",
      headerName: "Amount Per Installment",
      width: 250,
      ...colStyle,
      renderCell: (params) => (params.value ? params.value : "None"),
    },

    {
      field: "activityStatus",
      headerName: "Activity Status",
      width: 180,
    },
  ];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowHeight={80}
      columnHeaderHeight={45}
      disableColumnMenu
      disableColumnSorting
    />
  );
};

const monthCell = (params) => <>{params.value > 1 ? `${params.value} Months` : `${params.value} Month`}</>;

export default UserAdvanceTable;
