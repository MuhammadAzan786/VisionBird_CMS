import { Box, Grid, Paper, Tab } from "@mui/material";
import DashboardCard from "../../components/Cards/DashboardCard";
import clipboardList from "/clipboard-list.svg";
import folderopendot from "/folder-open-dot.svg";
import userIcon from "/user-round.svg";
import graduationcap from "/graduation-cap.svg";
import axios from "../../utils/axiosInterceptor";
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import EmployeesTable from "../../components/Tables/EmployeesTable";
import InterneeTable from "../../components/Tables/InterneeTable";

const titles = ["Employees", "Internees", "Tasks", "Portfolios"];
const bgGradients = [
  "linear-gradient(135deg, rgba(208,236,254,0.48) , rgba(115,186,251,0.48) )",
  "linear-gradient(135deg, rgba(239,214,255,0.48),  rgba(198,132,255,0.48)  )",
  "linear-gradient(135deg, rgba(255,245,204,0.48) , rgba(255,214,102,0.48) )",
  "linear-gradient(135deg, rgba(255,233,213,0.48) , rgba(255,172,130,0.48) )",
];

const colors = ["#2979E2", "#27097A", "#7A4100", "#EB593B"];
const bgColors = ["#2574DF", "#994CF4", "#EAA416", "#EB593B"];
const icons = [userIcon, graduationcap, clipboardList, folderopendot];
const defaultCardData = Array(4)
  .fill(null)
  .map((item, index) => {
    return {
      count: 0,
      title: titles[index],
      bgGradient: bgGradients[index],
      color: colors[index],
      bgColor: bgColors[index],
      icon: icons[index],
    };
  });

const Admin = () => {
  const [cardData, setCardData] = useState(defaultCardData);
  const [tabValue, setValue] = useState("employees");

  const handleChange = (e, value) => {
    setValue(value);
  };
  const fetchCardData = async () => {
    try {
      const data = await Promise.all([
        axios.get("/api/employee/all_employees"),
        axios.get("/api/internee/get_internees"),
        axios.get("/api/task/getTask"),
        axios.get("/api/posts/get_all_emp_posts"),
      ]);

      const cardList = data.map((item, index) => {
        if (index === data.length - 1) {
          return {
            count: item.data.data.length,
          };
        }
        return {
          count: item.data.length,
        };
      });

      setCardData((prev) => {
        return prev.map((item, index) => {
          return { ...item, count: cardList[index].count };
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  return (
    <>
      <Box>
        <Grid container spacing={5}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DashboardCard
                background={card.bgGradient}
                color={card.color}
                bgcolor={card.bgColor}
                svg={card.icon}
                count={card.count}
                title={card.title}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            variant="fullWidth"
            sx={{ marginBottom: "30px" }}
          >
            <Tab label="Employees" value="employees" />
            <Tab label="Internees" value="internees" />
          </TabList>

          <TabPanel value="employees" sx={{ padding: 0 }}>
            <EmployeesTable />
          </TabPanel>

          <TabPanel value="internees" sx={{ padding: 0 }}>
            <InterneeTable />
          </TabPanel>
        </TabContext>
      </Paper>
    </>
  );
};

export default Admin;
