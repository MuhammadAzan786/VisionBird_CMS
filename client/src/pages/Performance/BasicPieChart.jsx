import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "../../utils/axiosInterceptor";
import { Typography } from '@mui/material';

const isNewWeek = () => {
  const lastReset = localStorage.getItem("lastResetDate");
  const today = new Date();
  const todayDay = today.getDay(); // 1 = Monday
  const lastResetDate = lastReset ? new Date(lastReset) : null;

  if (todayDay === 1) { // If today is Monday
    if (!lastResetDate || lastResetDate.getDate() !== today.getDate()) {
      localStorage.setItem("lastResetDate", today.toISOString());
      return true; // New week, reset data
    }
  }
  return false;
};

const BasicPieChart = ({ _currentUser }) => {
  const [latestEvaluationData, setLatestEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvaluationData = async () => {
    setLoading(true);
    setError(null);

    if (!_currentUser) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    if (isNewWeek()) {
      setLatestEvaluationData(null); // Reset on Monday
    }

    try {
      const response = await axios.get(`/api/empOfWeek/evaluations/employee/${_currentUser}`);
      const evaluations = response.data.evaluations || [];

      const currentUserEvaluations = evaluations.filter(
        (evaluation) => evaluation.employee.id === _currentUser
      );

      if (currentUserEvaluations.length > 0) {
        const latestEvaluation = currentUserEvaluations.sort(
          (a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date)
        )[0];

        setLatestEvaluationData(latestEvaluation);
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluationData();
  }, [_currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!latestEvaluationData) return <p>No evaluation data found for the current user.</p>;

  const { behavior_points, work_attitude_points, quality_of_work_points, work_creativity, mistakes_points } = latestEvaluationData;

  const pieData = [
    { id: 0, value: behavior_points, label: `Behavior: ${behavior_points}` },
    { id: 1, value: work_attitude_points, label: `Attitude: ${work_attitude_points}` },
    { id: 2, value: quality_of_work_points, label: `Quality: ${quality_of_work_points}` },
    { id: 3, value: work_creativity, label: `Creativity: ${work_creativity}` },
    { id: 4, value: mistakes_points, label: `Mistakes: ${mistakes_points}` },
  ];

  return (
    <>
      <Typography>Points for the latest evaluation:</Typography>
      <PieChart
        series={[{ data: pieData }]}
        height={400}
        label={(data) => `${data.label} - ${data.value}`}
      />
    </>
  );
};

export default BasicPieChart;
