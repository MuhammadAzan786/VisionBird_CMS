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
        const pointsData = {
          behavior: Array(5).fill(0),
          workAttitude: Array(5).fill(0),
          qualityOfWork: Array(5).fill(0),
          workCreativity: Array(5).fill(0),
          mistakes: Array(5).fill(0),
        };

        evaluations.forEach((evaluation) => {
          const evaluationDate = new Date(evaluation.evaluation_date);
          const dayOfWeek = evaluationDate.getDay();

          if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
            const index = dayOfWeek - 1; // Convert Sunday-Saturday to 0-6 index (Monday=0, Friday=4)
            pointsData.behavior[index] += evaluation.behavior_points;
            pointsData.workAttitude[index] += evaluation.work_attitude_points;
            pointsData.qualityOfWork[index] += evaluation.quality_of_work_points;
            pointsData.workCreativity[index] += evaluation.work_creativity;
            pointsData.mistakes[index] += evaluation.mistakes_points;
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
    <Box sx={{ p: 3 }}>
      {dailyPoints.behavior.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: weekDays }]} // Weekdays from Monday to Friday
            series={[
              { data: dailyPoints.behavior, label: 'Behavior Points' },
              { data: dailyPoints.workAttitude, label: 'Work Attitude Points' },
              { data: dailyPoints.qualityOfWork, label: 'Quality of Work Points' },
              { data: dailyPoints.workCreativity, label: 'Work Creativity Points' },
              { data: dailyPoints.mistakes, label: 'Mistakes Points' },
            ]} // Displaying the detailed points as separate bars
            height={400}
          />
        </Box>
      ) : (
        <Typography>No daily points available</Typography>
      )}
    </Box>
  );
};

export default DetailedBarChart;
