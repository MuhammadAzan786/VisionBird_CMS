/* eslint-disable react/prop-types */

import { useState } from "react";

import axios from "../../../../utils/axiosInterceptor";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeNameCell from "../../../../components/Grid Cells/EmployeeProfileCell";
import { useQuery } from "@tanstack/react-query";
import CustomOverlay from "../../../../components/Styled/CustomOverlay";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { CalendarMonth, Money, RadioButtonChecked, Timeline, Visibility } from "@mui/icons-material";
import { CustomChip } from "../../../../components/Styled/CustomChip";
import { customColors } from "../../../../theme/colors";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ClockIcon } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const colStyle = {
  headerAlign: "center",
  align: "center",
};

const AdminSalaryTable = ({ advanceStatus }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [viewHistoryModal, setviewHistoryModal] = useState(false);
  const [transactionHistoryData, setTransactionHistoryData] = useState([]);

  const {
    data: fetchAllRequests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["al", advanceStatus],
    queryFn: async () => {
      if (!currentUser) return [];
      const result = await axios.post(`/api/advance_payments/admin/applications/${currentUser._id}`);
      const applications = result.data;
      const filteredApplications = applications.filter((application) => {
        if (advanceStatus === "all") {
          return application;
        } else if (advanceStatus === "pending") {
          console.log("isme aya hai pending");

          return application.activityStatus === "pending";
        } else {
          return application.activityStatus === "active";
        }
      });

      return filteredApplications || [];
    },
  });

  if (isLoading) {
    return <CustomOverlay open={true} />;
  }
  if (error) {
    toast.error(error.message);
  }

  if (fetchAllRequests && fetchAllRequests.length > 0 && rows.length === 0) {
    const newData = fetchAllRequests.map((item) => ({
      ...item,
      id: item._id,
    }));

    setRows(newData);
  }

  const toggleHistoryModal = (transactionData) => {
    console.log("toggle", transactionData);

    setTransactionHistoryData(transactionData);
    setviewHistoryModal(!viewHistoryModal);
  };

  const closeHistoryModal = () => {
    setviewHistoryModal(false);
  };

  const columns = [
    {
      field: "employee_name",
      headerName: "Employee",
      width: 150,
      renderCell: ({ row }) => (
        <EmployeeNameCell userId={row.employeeID} name={row.employeeName} src={row.employeeProImage?.secure_url} />
      ),
    },
    {
      field: "grossSalary",
      headerName: "Gross Sallary",
      width: 150,
      ...colStyle,
    },
    {
      field: "loanAmount",
      headerName: "Loan Amount",
      width: 150,
      cellClassName: "font-medium text-red-600",
      ...colStyle,
    },
    {
      field: "repaymentMethod",
      headerName: "Repayment Method",
      width: 200,
      ...colStyle,
    },

    {
      field: "numberOfInstallments",
      headerName: "Number Of Installments",
      width: 300,
      ...colStyle,
      renderCell: (params) => (params.value ? params.value : "None"),
    },
    {
      field: "amountPerInstallment",
      headerName: "Amount Per Installment",
      width: 300,
      ...colStyle,
      renderCell: (params) => (params.value ? params.value : "None"),
    },
    {
      field: "transactionHistory",
      headerName: "Transaction History",
      width: 250,
      ...colStyle,
      renderCell: (params) =>
        params.value ? (
          <Button variant="contained" startIcon={<Visibility />} onClick={() => toggleHistoryModal(params.value)}>
            View
          </Button>
        ) : (
          "None"
        ),
    },
    {
      field: "currentStatus",
      headerName: "Active Status",
      width: 180,
      ...colStyle,
      renderCell: (params) => {
        const { activityStatus } = params.row;
        console.log(activityStatus, params);
        if (activityStatus === "completed" || activityStatus === "active") {
          return <CustomChip label={activityStatus} status={activityStatus} />;
        }
        return "-";
      },
    },
    {
      field: "activityStatus",
      headerName: "Approval Status",
      width: 180,
      ...colStyle,
      renderCell: (params) => <StatusChange value={params.value} applicationId={params.row.id} />,
    },
  ];

  const processRowUpdate = async (newRow) => {
    const { id, approval_status, activity_status, employee_obj_id } = newRow;
    if (approval_status === "pending") {
      return { ...newRow, isNew: false };
    }
    try {
      const res = await axios.post(`/api/advance_payments/admin/advance-applications/?type=advanceSalary`, {
        currentUser,
        _id: id,
        approval_status,
        activity_status,
        employee_obj_id,
      });

      const newObj = { ...res.data, id: res.data._id };
      toast.success("Loan status updated successfully!");
      return { ...newObj, isNew: false };
    } catch (error) {
      toast.error("Error updating Loan status.");
      console.error("Error updating loan status:", error);
      return { ...newRow, isNew: true };
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowUpdateError = (error) => {
    console.error("Error during row update:", error);
    toast.error("An error occurred while updating the row.");
  };

  return (
    <>
      <Modal
        open={viewHistoryModal}
        onClose={closeHistoryModal}
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TransactionHistory data={transactionHistoryData} />
      </Modal>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel} // for checking which row is in edit mode
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleRowUpdateError}
        disableColumnMenu
        disableColumnSorting
        rowHeight={80}
        columnHeaderHeight={45}
      />
    </>
  );
};

const CustomMenuItem = ({ label, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
      }}
    >
      <RadioButtonChecked sx={{ color }} />
      <Typography sx={{ textTransform: "capitalize" }}>{label}</Typography>
    </Box>
  );
};

const StatusChange = ({ value, applicationId }) => {
  const statusOptions = ["pending", "approved", "rejected"];
  let updatedValue = value;

  if (value === "completed" || value === "active") {
    updatedValue = "approved";
  }
  const [activeStatus, setActiveStatus] = useState(updatedValue);

  const handleChange = async (e) => {
    try {
      const value = e.target.value;
      const res = await axios.post(`/api/advance_payments/admin/change_status`, { value, applicationId });
      toast.success(res.data.message);
      setActiveStatus(e.target.value);
    } catch (error) {
      console.log(error);
      toast.success("Error changing status.");
    }
  };

  const disableOptions = ["approved", "rejected", "complete", "active"];
  return (
    <Select value={activeStatus} fullWidth onChange={handleChange} disabled={disableOptions.includes(activeStatus)}>
      {statusOptions.map((item, index) => (
        <MenuItem value={item} key={index}>
          <CustomMenuItem label={item} color={customColors.yellow} />
        </MenuItem>
      ))}
    </Select>
  );
};

const TransactionHistory = ({ data }) => {
  const [tabValue, setTabValue] = useState("installment1");
  const handleTabChange = (e, value) => {
    setTabValue(value);
  };

  console.log("aaaaaaaaaaa", data);

  return (
    <Paper sx={{ minWidth: "50%" }}>
      <TabContext value={tabValue}>
        <TabList onChange={handleTabChange} variant="fullWidth" sx={{ marginBottom: "30px" }}>
          {data.map((item, index) => {
            const label = `Installment ${index + 1}`;
            const value = `installment${index + 1}`;
            return <Tab label={label} value={value} key={index} />;
          })}
        </TabList>

        {data.map((transaction, index) => {
          const value = `installment${index + 1}`;
          return (
            <TabPanel value={value} sx={{ padding: 0 }} key={index}>
              <List>
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <ClockIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Paid Date"} secondary={dayjs(transaction.paidDate).format("DD MMM, YYYY")} />
                </ListItem>
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <Money />
                  </ListItemIcon>
                  <ListItemText primary={"Loan Remaining"} secondary={transaction.loanAmountRemaning} />
                </ListItem>

                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <CalendarMonth />
                  </ListItemIcon>
                  <ListItemText primary={"Installment Remaining"} secondary={transaction.installmentRemaning} />
                </ListItem>
              </List>
            </TabPanel>
          );
        })}
      </TabContext>
    </Paper>
  );
};

export default AdminSalaryTable;
