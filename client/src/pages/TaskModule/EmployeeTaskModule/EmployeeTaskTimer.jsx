import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";

const EmployeeTaskTimer = ({ taskStartTime, totalDuration, taskStatus, pauseStatus }) => {
  const [progress, setProgress] = useState(100);
  const [remainingHours, setRemainingHours] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {

    if (taskStatus === "In Progress" && taskStartTime) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - new Date(taskStartTime).getTime();
        const remainingTime = totalDuration * 1000 - elapsedTime;

        if (remainingTime <= 0) {
          clearInterval(interval);
          setProgress(0);
          setRemainingHours(0);
          setRemainingMinutes(0);
          setRemainingSeconds(0);
          setIsTimeUp(true);
      
        } else {
          const hours = Math.floor(remainingTime / (1000 * 60 * 60));
          const minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

          setRemainingHours(hours);
          setRemainingMinutes(minutes);
          setRemainingSeconds(seconds);
          setIsTimeUp(false);

          const progressPercentage =
            (remainingTime / (totalDuration * 1000)) * 100;
          setProgress(progressPercentage);
        }


        console.log("Total Duration", totalDuration)


      }, 1000);

      return () => clearInterval(interval);

    } else if (taskStatus === "Not Started") {

      // Calculate remaining time in hours, minutes, seconds
      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const seconds = totalDuration % 60;

      setRemainingHours(hours);
      setRemainingMinutes(minutes);
      setRemainingSeconds(seconds);

      // Reset progress
      setProgress(0);
    }
  }, [taskStartTime, totalDuration, taskStatus]);

  // Render based on taskStatus and isTimeUp
  if (taskStatus === "Not Started") {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          Time to do the task: {remainingHours}h {remainingMinutes}m{" "}
          {remainingSeconds}s
        </Typography>
      </Box>
    );
  }

  if (isTimeUp ) {
    return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          Time's Up
        </Typography>
      </Box>
    );
  }

  if (
    taskStatus === "Completed" ||
    (progress === 0 && taskStatus !== "In Progress")
  ) {
    return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          Task Done
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", marginBottom: "5px" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "400", marginRight: "5px" }}
        >
          Remaining Time :
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          {remainingHours}h {remainingMinutes}m {remainingSeconds}s
        </Typography>
      </Box>
      {taskStatus !== "Not Started" && !isTimeUp && (
        <LinearProgress variant="determinate" value={progress} />
      )}
    </Box>
  );
};

export default EmployeeTaskTimer;
