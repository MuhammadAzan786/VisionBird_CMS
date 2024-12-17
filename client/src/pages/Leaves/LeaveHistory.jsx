import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Autocomplete,
  Paper,
  TextField,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useMutation, useQuery } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import { useSelector } from "react-redux";
import { customColors } from "../../theme/colors";

// Initialize the localizer for moment
const localizer = momentLocalizer(moment);

const LeaveHistory = () => {
  const [highlightedDates, setHighlightedDates] = useState([]); // Store detailed leave events
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the currently selected date
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected employee
  const [month, setMonth] = useState(moment(currentDate).month());
  const [year, setYear] = useState(moment(currentDate).year());
  const currentUser = useSelector((state) => state.user.currentUser);

  // Mutation to fetch leave data
  const mutation = useMutation({
    mutationFn: async ({ id, month, year }) =>
      axios.get(`/api/leave/my-leaves/${id}?month=${month + 1}&year=${year}`),
    onSuccess: (data) => {
      // Filter the leave data to include only approved leaves
      const approvedLeaves = data.data.filter(
        (item) => item.status === "accepted"
      );

      console.log("approvedLeaves", approvedLeaves);

      // Map the filtered approved leaves to the desired format
      const leaveEvents = approvedLeaves.map((item) => ({
        start: new Date(
          item.selectedDate ? item.selectedDate : item.leavesStart
        ),
        end: new Date(item.selectedDate ? item.selectedDate : item.leavesEnd),
        title: item.leaveType, // Example: Sick Leave, Casual Leave
        leaveType: item.leaveType,
        leaveCategory: item.leaveCategory,
        reason: item.reason,
        fromTime: item.fromTime,
        selectedDate: new Date(item.selectedDate),

        toTime: item.toTime,
      }));

      // Set the filtered and mapped leave events
      setHighlightedDates(leaveEvents); // Store detailed leave events
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });

  // Query to fetch employee data
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => axios.get("api/employee/get_managers_employees"),
  });

  // Search leaves by employee ID, month, and year
  const searchLeaves = (id, date = currentDate) => {
    if (!id) return;
    const month = moment(date).month();
    const year = moment(date).year();
    mutation.mutate({ id, month, year });
  };

  useEffect(() => {
    if (currentUser.role === "employee") {
      const id = currentUser._id;
      mutation.mutate({ id, month, year });
    }
  }, [month, year]);

  if (isLoading) {
    return <CustomOverlay open={true} />;
  }

  // Map employees to the needed format for Autocomplete
  const names = data?.data.map((item) => ({
    label: item.employeeName,
    id: item._id,
  }));

  // Handle employee selection
  const handleEmployeeSelect = (event, value) => {
    setSelectedEmployee(value); // Use value.id directly for clarity
    searchLeaves(value?.id, currentDate); // Fetch leaves for the selected employee
  };

  // Generate month and year options
  const monthOptions = moment.months();
  const yearOptions = Array.from(
    { length: 20 },
    (_, index) => 2024 - 10 + index
  );

  // Styling for event
  const styleGetter = (event) => {
    let style = {};
    switch (event.leaveType) {
      case "Long Leaves":
        style = { backgroundColor: customColors.red };
        break;
      case "Full Leave":
        style = { backgroundColor: customColors.yellow };
        break;
      case "Half Leave":
        style = { backgroundColor: customColors.main };

        break;
      case "Short Leave":
        style = { backgroundColor: customColors.green };
        break;

      default:
        style = {};
        break;
    }
    return { style };
  };

  // Tooltip wrapper for event details
  const eventWrapper = ({ event }) => (
    <Tooltip
      title={
        <div>
          <Typography variant="subtitle1">
            {event.title} ( {event.leaveCategory})
          </Typography>
          {/* <Typography variant="subtitle1">
            Category: {event.leaveCategory}
          </Typography> */}

          {event.title === "Long Leaves" && (
            <>
              <Typography variant="body2">
                Start: {moment(event.start).format("MMMM Do, YYYY")}
              </Typography>
              <Typography variant="body2">
                End: {moment(event.end).format("MMMM Do, YYYY")}
              </Typography>
            </>
          )}
          {(event.title === "Short Leave" || event.title === "Half Leave") && (
            <>
              <Typography>From: {event.fromTime}</Typography>
              <Typography>To: {event.toTime}</Typography>
            </>
          )}
          {(event.title === "Full Leave" || event.title === "Half Leave") && (
            <>
              <Typography variant="body2">
                Date: {moment(event.selectedDate).format("MMMM Do, YYYY")}
              </Typography>
            </>
          )}
          {event.description && (
            <Typography variant="body2">
              Description: {event.description}
            </Typography>
          )}
          {event.reason && (
            <Typography variant="body2">Reason: {event.reason}</Typography>
          )}
        </div>
      }
    >
      <span>{event.title}</span>
    </Tooltip>
  );

  // Highlight dates with leave events
  const dayPropGetter = (date) => {
    const leaveEvent = highlightedDates.find(
      (event) =>
        moment(event.start).isSame(date, "day") ||
        moment(event.end).isSame(date, "day")
    );
    if (leaveEvent) {
      const leaveColor = customColors.mainAlpha; // Default color for other leave types
      return {
        style: {
          backgroundColor: leaveColor,
          color: "red", // Text color for contrast
        },
      };
    }
    return {}; // No custom style for dates without a leave event
  };

  return (
    <Paper>
      <Box style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {/* Employee Search */}
        {currentUser.role !== "employee" && (
          <Autocomplete
            disablePortal
            options={names}
            slotProps={{ paper: {elevation:1} }}
            onChange={handleEmployeeSelect}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Search Employee Name" />
            )}
          />
        )}

        {/* Month Selector */}
        <Select
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          displayEmpty
          style={{ minWidth: 120 }}
        >
          {monthOptions.map((month, index) => (
            <MenuItem key={index} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>

        {/* Year Selector */}
        <Select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          displayEmpty
          style={{ minWidth: 120 }}
        >
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={highlightedDates}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView="month"
        views={["month"]}
        date={moment().year(year).month(month).toDate()} // Use year and month state
        onNavigate={(date) => {
          const newMonth = moment(date).month();
          const newYear = moment(date).year();
          setMonth(newMonth);
          setYear(newYear);
          setCurrentDate(moment().year(newYear).month(newMonth).toDate());
          if (selectedEmployee) {
            mutation.mutate({
              id: selectedEmployee.id,
              month: newMonth,
              year: newYear,
            });
          }
        }}
        components={{ event: eventWrapper }}
        eventPropGetter={styleGetter}
        //  dayPropGetter={dayPropGetter} // Apply custom styles to days
      />
    </Paper>
  );
};

export default LeaveHistory;
