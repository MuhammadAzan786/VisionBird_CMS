import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from "../../utils/axiosInterceptor";
import { Box, Typography } from '@mui/material';

const getWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(today);
  friday.setDate(today.getDate() + (5 - dayOfWeek));
  friday.setHours(23, 59, 59, 999);
  return { monday, friday };
};

const generateWeekDays = () => {
  const { monday } = getWeekRange(); // Get the correct Monday date
  const days = [];

  for (let i = 0; i < 5; i++) { // Only generate Monday to Friday
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push(date.toLocaleDateString('en-US', { weekday: 'short' })); 
  }

  return days;
};

const TaskChart = ({ _currentUser }) => {
  const [dailyPoints, setDailyPoints] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      setError(null);
    
      if (!_currentUser) {
        setError('User ID is required');
        setLoading(false);
        return;
      }
    
      try {
        const { monday, friday } = getWeekRange();
        const response = await axios.get(`/api/task/getCompletedTasksByEmployeeIdDate/${_currentUser}`);
        const tasks = response.data || [];
        const pointsData = Array(5).fill(0); // Initialize points for Monday to Friday
    
        tasks.forEach((task) => {
          const updatedAtDate = new Date(task.updatedAt);
    
          // ✅ Convert task date to local time (remove UTC issues)
          const localDate = new Date(updatedAtDate.getFullYear(), updatedAtDate.getMonth(), updatedAtDate.getDate());
          
          // ✅ Ensure date falls within Monday to Friday
          if (localDate >= monday && localDate <= friday) {
            const dayOfWeek = localDate.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { 
              const index = dayOfWeek - 1; // Monday = 0, ..., Friday = 4
              pointsData[index] += task.pointsGained;
            }
          }
        });
    
        setDailyPoints(pointsData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    

    fetchWeeklyData();
  }, [_currentUser]);

  const weekDays = generateWeekDays();
  const maxY = Math.max(...dailyPoints, 10) + 10; // Ensure maxY is at least 10

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <Typography variant="h6">Task Points earned this week (Monday to Friday)</Typography>
      <Box sx={{ p: 3 }}>

        {dailyPoints.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <LineChart
              xAxis={[{ data: weekDays, scaleType: 'point', label: "Weekday" }] }
              yAxis={[{ min: 0, max: maxY }]} // Set dynamic max value based on task data
              series={[{
                data: dailyPoints,
                label: "Total Points Earned",
                color: "#1a237e",
              }]}
              height={300}
            />
          </Box>
        ) : (
          <Typography>No daily points available</Typography>
        )}
      </Box>
    </>
  );
};

export default TaskChart;
