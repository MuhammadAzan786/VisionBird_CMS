import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
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

const BasicLineChart = ({ _currentUser }) => {
  const [dailyPoints, setDailyPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyPoints = async () => {
    setLoading(true);
    setError(null);
    if (!_currentUser) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/empOfWeek/evaluations/employee/${_currentUser}`);
      const evaluations = response.data.evaluations || [];

      if (evaluations.length > 0) {
        const pointsData = Array(5).fill(0); // Array for Monday to Friday (5 days)

        evaluations.forEach((evaluation) => {
          const evaluationDate = new Date(evaluation.evaluation_date);
          const dayOfWeek = evaluationDate.getDay();
          
          if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
            const index = dayOfWeek - 1; // Convert Sunday-Saturday to 0-6 index (Monday=0, Friday=4)
            pointsData[index] += evaluation.total_points;
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

  useEffect(() => {
    fetchDailyPoints();
  }, [_currentUser]);

  const weekDays = generateWeekDays(); // Monday to Friday

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <>

              <Typography>
                  Points earned by this week
              </Typography>
    <Box sx={{ p: 3 }}>


      {dailyPoints.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <LineChart
            xAxis={[{ data: weekDays, scaleType: 'point', label: "Weekday" }]}
            yAxis={[{ label: "Total Points", min: 1, max: 30 }]}
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
