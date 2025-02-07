import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from "../../utils/axiosInterceptor";
import { Box, Typography } from '@mui/material';

// Helper function to generate the weekday names (Monday to Friday)
const generateWeekDays = () => {
  const today = new Date();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDay = today.getDay();
  const shift = currentDay === 0 ? -6 : 1 - currentDay; // Start from Monday

  return days.map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() + shift + index); // Adjust date to the respective weekday
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
};

const DetailedBarChart = ({ _currentUser }) => {
  const [dailyTasks, setDailyTasks] = useState(Array(5).fill(0)); // Tasks count per weekday
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyTasks = async () => {
    setLoading(true);
    setError(null);

    if (!_currentUser) {
        setError('User ID is required');
        setLoading(false);
        return;
    }

    try {
        const response = await axios.get(`/api/task/getCompletedTasksByEmployeeIdDate/${_currentUser}`);
        const tasks = response.data || []; // Ensure data is correctly fetched

        if (tasks.length > 0) {
            const taskCountByDay = Array(5).fill(0); // Monday to Friday

            tasks.forEach((task) => {
                if (task.taskcompleteStatus === "completed" && task.DateTime) {
                    const taskDate = new Date(task.DateTime);
                    const dayOfWeek = taskDate.getDay();

                    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                        const index = dayOfWeek - 1; // Convert Monday=1 to array index 0
                        taskCountByDay[index] += 1; // Count tasks for that weekday
                    }
                }
            });

            setDailyTasks(taskCountByDay);
        } else {
            setError('No tasks found for this user');
        }
    } catch (err) {
        console.error("Error fetching employee tasks:", err);
        setError("Failed to fetch data");
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchDailyTasks();
  }, [_currentUser]);

  const weekDays = generateWeekDays(); // Monday to Friday

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {dailyTasks.some(count => count > 0) ? (
        <Box sx={{ mb: 3 }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: weekDays }]} // Weekdays from Monday to Friday
            series={[{ data: dailyTasks, label: 'Tasks Completed', color: "#1a237e" }]} // Task count per day
            height={400}
          />
        </Box>
      ) : (
        <Typography>No tasks completed this week 
          
        </Typography>
      )}
    </Box>
  );
};

export default DetailedBarChart;
