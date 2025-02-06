import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "../../utils/axiosInterceptor";

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

    try {
      // Fetching evaluation data for the current user
      const response = await axios.get(`/api/empOfWeek/evaluations/employee/${_currentUser}`);
      const evaluations = response.data.evaluations || [];

      // Filter the data for the current user
      const currentUserEvaluations = evaluations.filter(
        (evaluation) => evaluation.employee.id === _currentUser
      );

      // Sort evaluations by date (assuming each evaluation has a `date` field)
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!latestEvaluationData) {
    return <p>No evaluation data found for the current user.</p>;
  }

  // Use the latest evaluation to display points
  const {
    behavior_points,
    work_attitude_points,
    quality_of_work_points,
    work_creativity,
    mistakes_points,
  } = latestEvaluationData;

  // Pie chart data: display points for the latest evaluation
  const pieData = [
    { id: 0, value: behavior_points, label: `Behavior: ${behavior_points}` },
    { id: 1, value: work_attitude_points, label: `Attitude: ${work_attitude_points}` },
    { id: 2, value: quality_of_work_points, label: `Quality: ${quality_of_work_points}` },
    { id: 3, value: work_creativity, label: `Creativity: ${work_creativity}` },
    { id: 4, value: mistakes_points, label: `Mistakes: ${mistakes_points}` },
  ];

  return (
    <PieChart
      series={[{ data: pieData }]}
      height={400}
      label={(data) => `${data.label} - ${data.value}`} // Displaying points alongside the category name
      tooltip={({ category, value, percentage }) => (
        <div>
          <strong>{category}</strong>
          <div>{`Points: ${value}`}</div>
          <div>{`Percentage: ${percentage.toFixed(2)}%`}</div>
        </div>
      )}
    />
  );
};

export default BasicPieChart;
