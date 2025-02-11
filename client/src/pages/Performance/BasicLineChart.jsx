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
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days.map(day => day.slice(0, 3)); // Get short names like "Mon"
};

const BasicLineChart = ({ _currentUser }) => {
  const [dailyPoints, setDailyPoints] = useState(Array(5).fill(0)); // 5 days: Mon-Fri
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
        const currentWeekMonday = getMondayOfCurrentWeek();
        const todayStr = new Date().toISOString().split("T")[0];

        const response = await axios.get(`/api/empOfWeek/evaluations/employee/${_currentUser}`);
        const evaluations = response.data.evaluations || [];

        const pointsData = Array(5).fill(0);

        evaluations.forEach((evaluation) => {
          const evaluationDate = new Date(evaluation.evaluation_date);
          const evalDateStr = evaluationDate.toISOString().split("T")[0];

          const dayOfWeek = evaluationDate.getDay(); // 0 (Sunday) to 6 (Saturday)
          
          if (dayOfWeek >= 1 && dayOfWeek <= 5 && evalDateStr >= currentWeekMonday && evalDateStr <= todayStr) {
            pointsData[dayOfWeek - 1] += evaluation.total_points;
          }
        });

        setDailyPoints(pointsData);
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
  const maxY = Math.max(...dailyPoints) + 10;

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <Typography>Points earned by this week</Typography>
      <Box sx={{ p: 3 }}>
        {dailyPoints.some(point => point > 0) ? (
          <Box sx={{ mb: 3 }}>
            <LineChart
              xAxis={[{ data: weekDays, scaleType: 'point', label: "Weekday" }]}
              yAxis={[{ min: 0, max: maxY }]}
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
