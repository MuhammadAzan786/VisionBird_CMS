import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from "../../utils/axiosInterceptor";
import { Box, Typography } from '@mui/material';

const getMondayOfCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

const generateWeekDays = () => {
  const today = new Date();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentMonday = getMondayOfCurrentWeek();
  const startDate = new Date(currentMonday);

  return days.map((_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
};

const BasicLineChart = ({ _currentUser }) => {
  const [dailyPoints, setDailyPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyPoints = async () => {
      setLoading(true);
      setError(null);

      if (!_currentUser) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        const storedWeek = localStorage.getItem("lastWeekMonday");
        const currentWeekMonday = getMondayOfCurrentWeek();

        if (storedWeek !== currentWeekMonday) {
          localStorage.setItem("lastWeekMonday", currentWeekMonday);
          setDailyPoints([]); // Reset the data when a new Monday starts
        }

        const response = await axios.get(`/api/empOfWeek/evaluations/employee/${_currentUser}`);
        const evaluations = response.data.evaluations || [];

        if (evaluations.length > 0) {
          const pointsData = Array(5).fill(0);
          evaluations.forEach((evaluation) => {
            const evaluationDate = new Date(evaluation.evaluation_date);
            const evalWeekMonday = getMondayOfCurrentWeek();
            const evalDateStr = evaluationDate.toISOString().split("T")[0];

            if (evalDateStr >= evalWeekMonday) {
              const dayOfWeek = evaluationDate.getDay();
              if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                pointsData[dayOfWeek - 1] += evaluation.total_points;
              }
            }
          });

          setDailyPoints(pointsData);
        } else {
          setError('No evaluations found for this user');
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPoints();
  }, [_currentUser]);

  const weekDays = generateWeekDays();
  const maxY = Math.max(...dailyPoints) + 10; // Add a margin for visual clarity (e.g., +10)
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <Typography>Points earned by this week</Typography>
      <Box sx={{ p: 3 }}>
        {dailyPoints.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <LineChart
              xAxis={[{ data: weekDays, scaleType: 'point', label: "Weekday" }]}
              yAxis={[{ min: 0, max: maxY }]} // Set dynamic max value based on task data
              series={[{
                data: dailyPoints,
                label: "Total Points",
                color: "#1a237e",
              }]}
              height={500}
            />
          </Box>
        ) : (
          <Typography>No daily points available</Typography>
        )}
      </Box>
    </>
  );
};

export default BasicLineChart;
