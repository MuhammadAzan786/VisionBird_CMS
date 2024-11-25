import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";

import taskSvg from "/task.svg";

function TaskCard() {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/task/getTask",
        {
          withCredentials: true,
        }
      );
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          WebkitBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          MozBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          position: "relative",
          "&:hover": {
            boxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
            WebkitBoxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
            MozBoxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
          },
          "&:hover .hover-line": {
            height: "4px",
            backgroundColor: "#26C6F9",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            padding: "5px",
            paddingY: "17px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              height: "auto",
            }}
          >
            <Box backgroundColor="#DCF6FE" borderRadius={"5px"} padding={"8px"}>
              <img
                src={taskSvg}
                alt="My SVG"
                style={{
                  width: "35px",
                  height: "35px",
                  filter:
                    "brightness(0) saturate(100%) invert(69%) sepia(20%) saturate(7484%) hue-rotate(165deg) brightness(107%) contrast(95%)",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 500 }}
                variant="h5"
                component="h2"
                textAlign={"center"}
              >
                NO. of Tasks
              </Typography>
              <Typography
                sx={{ fontWeight: 600, color: "#666666" }}
                variant="h3"
                component="p"
              >
                {tasks.length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Box
          className="hover-line"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "#26C6F9",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            transition: "all 0.3s ease-in-out",
          }}
        />
      </Card>
    </div>
  );
}

export default TaskCard;
