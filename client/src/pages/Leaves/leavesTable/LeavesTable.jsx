import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  FormHelperText,
  Paper,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EmployeeNameCell from "../../../components/Grid Cells/EmployeeProfileCell";
import InActiveInterneesTable from "../../ManageEmployee/InActiveInterneesTable";
import ActiveInterneesTable from "../../ManageEmployee/ActiveInterneesTable";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InterneeTable from "../../../components/Tables/InterneeTable";
import CreateInternee from "../../ManageEmployee/CreateInternee";
import {
  CheckCircleOutline,
  GroupOutlined,
  HistoryOutlined,
  NewReleasesOutlined,
} from "@mui/icons-material";
import { useState } from "react";

LeavesTable.propTypes = {
  allLeaves: PropTypes.array.isRequired,
};

export default function LeavesTable({ allLeaves, pendingLeaves }) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("all_leaves");
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const times = new Date(0, 0, 0, hours, minutes);
    const formattedTime = times.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  };
  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const columns = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <EmployeeNameCell
            src={row?.from?.employeeProImage.secure_url}
            name={row?.from?.employeeName}
          />
        );
      },
    },
    { field: "status", headerName: "Status", width: 300 },
    { field: "leaveCategory", headerName: "Category", width: 150 },
    { field: "leaveType", headerName: "Type", width: 120 },
    {
      field: "date",
      headerName: "Leave Date",
      width: 250,
      renderCell: (params) => (
        <>
          <Box display="flex" flexDirection="column">
            {params.row.leaveType === "Long Leaves" ? (
              <>
                <Typography variant="caption" display="block">
                  Start:{" "}
                  {dayjs(params.row.leavesStart).format("dddd, MMMM D, YYYY")}
                </Typography>
                <Typography variant="caption" display="block">
                  End:{" "}
                  {dayjs(params.row.leavesEnd).format("dddd, MMMM D, YYYY")}
                </Typography>
              </>
            ) : (
              <Typography variant="inherit" display="block">
                {dayjs(params.row.selectedDate).format("dddd, MMMM D, YYYY")}
              </Typography>
            )}
          </Box>
        </>
      ),
    },
    // {
    //   field: "time",
    //   headerName: "Time",
    //   width: 120,
    //   renderCell: (params) => (
    //     <Box display="flex" flexDirection="column">
    //       {params.row.leaveType === "Half Leave" ? (
    //         <>
    //           <Typography variant="caption" display="block">
    //             From: {formatTime(params.row.fromTime)}
    //           </Typography>
    //           <Typography variant="caption" display="block">
    //             To: {formatTime(params.row.toTime)}
    //           </Typography>
    //         </>
    //       ) : (
    //         <Typography variant="caption" display="block" fontWeight="bold">
    //           -
    //         </Typography>
    //       )}
    //     </Box>
    //   ),
    // },
    
    { field: "reason", headerName: "Reason", width: 300 },

    {
      field: "createdAt",
      headerName: "Requested On",
      width: 250,
      valueGetter: (params) =>
        dayjs(params.row.createdAt).format("dddd, MMMM D, YYYY"),
    },
  ];

  const rows = allLeaves?.map((leave) => ({
    ...leave,
    id: leave._id,
  }));
  const rows2 = pendingLeaves?.map((leave) => ({
    ...leave,
    id: leave._id,
  }));

  return (
    <Paper sx={{ padding: "40px" }}>
      <TabContext value={tabValue}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <TabList onChange={handleTabValue}>
            <Tab
              label="All Leaves"
              icon={<GroupOutlined />}
              value="all_leaves"
              sx={{ letterSpacing: 1 }}
            />
            <Tab
              label="Pending Leaves"
              icon={<NewReleasesOutlined />}
              value="pending_leaves"
              sx={{ letterSpacing: 1 }}
            />
          </TabList>
        </Box>

        {/* Tab panels */}
        <TabPanel value="all_leaves" sx={{ p: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            onRowClick={(params) => navigate(`/view-leave/${params.id}`)}
          />
        </TabPanel>
        <TabPanel value="pending_leaves" sx={{ p: 0 }}>
          <DataGrid
            rows={rows2}
            columns={columns}
            pageSize={10}
            onRowClick={(params) => navigate(`/view-leave/${params.id}`)}
          />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}
