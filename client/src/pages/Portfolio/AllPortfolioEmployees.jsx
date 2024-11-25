import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { Link } from "react-router-dom";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";

function AllPortfolioEmployees() {
  const [employees, setEmployees] = useState([]);
  const [colors, setColors] = useState([]);

  const getEmp = async () => {
    try {
      const searchTerm = "";
      const response = await axios.get(
        `/api/employee/get_managers_employees?search=${searchTerm}`
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

  const getRandomColor = () => {
    const letters = "9ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  useEffect(() => {
    const newColors = employees.map(() => getRandomColor());
    setColors(newColors);
  }, [employees]);

  console.log("colors", colors);

  return (
    <Box p="30px">
      <Grid container spacing={3}>
        {employees.map((employee, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                position: "relative",
                backgroundColor: "#e6ebf1",
                borderRadius: "5px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              {/* Ribbon */}
              <Box
                sx={{
                  position: "absolute",
                  top: 52,
                  right: -16,
                  width: 100,
                  height: 25,
                  backgroundColor:
                    employee.role === "manager" ? "#1E3E62" : "#5B99C2",
                  color: "white",
                  textAlign: "center",
                  lineHeight: "25px",
                  transform: "rotate(44deg)",
                  transformOrigin: "top right",
                  boxShadow: 4,
                  fontSize: "0.75rem",
                }}
              >
                {employee.role}
              </Box>

              <Avatar
                alt={employee.employeeName}
                src={employee.employeeProImage}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 1,
                  border: "2px solid #355d8b",
                  boxShadow: "0 4px 10px rgba(74, 144, 226, 0.5)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: "#3b4056",
                  textAlign: "center",
                  fontSize: "18px",
                  lineHeight: "28px",
                }}
              >
                {employee.employeeName}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#888a98",
                  textAlign: "center",
                  mb: 1,
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "21px",
                }}
              >
                {employee.email}
              </Typography>
              <Box sx={{ mt: "auto", width: "100%", textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<InsertPhotoTwoToneIcon />}
                  component={Link}
                  to={`/portfolio/${employee._id}`}
                  sx={{
                    backgroundColor: "#1E3E62",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "5px 35px",
                    "&:hover": {
                      backgroundColor: "#357ab7",
                    },
                  }}
                >
                  Explore Work
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AllPortfolioEmployees;
