import PropTypes from "prop-types";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EmployeeNameCell from "../../../components/Grid Cells/EmployeeProfileCell";

LeavesTable.propTypes = {
  allLeaves: PropTypes.array.isRequired,
};

export default function LeavesTable({ allLeaves }) {
  const navigate = useNavigate();

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

  const columns = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 200,
      renderCell: ({ row }) => {
        return <EmployeeNameCell src={row?.from?.employeeProImage.secure_url} name={row?.from?.employeeName} />;
      },
    },
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
                  Start: {dayjs(params.row.leavesStart).format("dddd, MMMM D, YYYY")}
                </Typography>
                <Typography variant="caption" display="block">
                  End: {dayjs(params.row.leavesEnd).format("dddd, MMMM D, YYYY")}
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
    { field: "status", headerName: "Status", width: 300 },
    { field: "reason", headerName: "Reason", width: 300 },

    {
      field: "createdAt",
      headerName: "Requested On",
      width: 250,
      valueGetter: (params) => dayjs(params.row.createdAt).format("dddd, MMMM D, YYYY"),
    },
  ];

  const rows = allLeaves.map((leave) => ({
    ...leave,
    id: leave._id,
  }));

  return (
    <Paper>
      <Typography variant="h6" marginBottom="30px">
        Employee Leaves
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        onRowClick={(params) => navigate(`/view-leave/${params.id}`)}
      />
    </Paper>
  );
}
