import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";

import employeeSvg from "/employee.svg";

function EmployeeCard() {
  const [employees, setEmployees] = useState([]);

  const getEmp = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/employee/all_employees",
        {
          withCredentials: true,
        }
      );
      setEmployees(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmp();
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
            backgroundColor: "#00AFEF",
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
            <Box backgroundColor="#E7E7FF" borderRadius={"5px"} padding={"8px"}>
              <img
                src={employeeSvg}
                alt="My SVG"
                style={{
                  width: "35px",
                  height: "35px",
                  filter:
                    "invert(42%) sepia(97%) saturate(2761%) hue-rotate(230deg) brightness(104%) contrast(96%)",
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
                NO. of Employees
              </Typography>
              <Typography
                sx={{ fontWeight: 600, color: "#666666" }}
                variant="h3"
                component="p"
              >
                {employees.length}
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
            backgroundColor: "#00AFEF",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            transition: "all 0.3s ease-in-out",
          }}
        />
      </Card>
    </div>
  );
}

export default EmployeeCard;
