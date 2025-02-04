import { LineChart } from '@mui/x-charts/LineChart';

const generateDays = (numDays) => {
  const today = new Date();
  return Array.from({ length: numDays }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (numDays - 1) + i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
};

const salesData = [10, 15, 8, 20, 12, 18, 25, 30, 22, 28];

const BasicLineChart = () => {
  const days = generateDays(salesData.length);

  return (
    <LineChart
      xAxis={[{ data: days, scaleType: 'point', label: "Date" }]}
      series={[
        {
          data: salesData,
          label: "Points",
          color: "blue",
        },
      ]}
      height={500}
    />
  );
};

export default BasicLineChart;
