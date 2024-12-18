import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";
import axios from "../../utils/axiosInterceptor"; 
import { setHighlightedDates } from "../../redux/ReportDatesSlice";
import { useSelector, useDispatch } from "react-redux";

// Initialize the localizer for moment
const localizer = momentLocalizer(moment);

// Calendar component
const CalendarComponent = ({ onSelectDate }) => {
  const dispatch = useDispatch();
  const highlightedDates = useSelector(
    (state) => state.reportDates?.dates || []
  );
  console.log(highlightedDates);

  // Fetch dates from API and store them
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get("/api/empOfWeek/getReportDates");
        const mappedDates = response.data.dates.map((date) => new Date(date));
        console.log("Fetched Dates:", mappedDates);
        dispatch(setHighlightedDates(mappedDates));
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
  }, [dispatch]);
  const handleDateClick = (slotInfo) => {
    onSelectDate(slotInfo.start);
  };

  // Style getter for day cells to highlight specific dates
  const dayPropGetter = (date) => {
    const isHighlighted = highlightedDates.some(
      (highlightedDate) =>
        date.getFullYear() === highlightedDate.getFullYear() &&
        date.getMonth() === highlightedDate.getMonth() &&
        date.getDate() === highlightedDate.getDate()
    );

    if (isHighlighted) {
      return {
        style: {
          backgroundColor: "#7FA1C3", // Custom color for highlighted dates
        },
      };
    }
    return {}; // Default styling for non-highlighted dates
  };

  return (
    <Calendar
      localizer={localizer}
      events={[]} // No events, just highlighting dates
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      selectable
      onSelectSlot={handleDateClick}
      defaultView="month"
      views={["month"]}
      dayPropGetter={dayPropGetter} // Apply custom styling for specific days
    />
  );
};

export default CalendarComponent;
