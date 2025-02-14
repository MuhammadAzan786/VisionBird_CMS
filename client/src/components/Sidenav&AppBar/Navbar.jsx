import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  AssignmentOutlined,
  DashboardOutlined,
  DoorFrontOutlined,
  EmojiEventsOutlined,
  ManageAccountsOutlined,
  PaymentOutlined,
  PersonSearchOutlined,
} from "@mui/icons-material";
import DynamicMenu from "../DynamicMenu";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Navbar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  handleMouseLeave,
  handleMouseEnter,
  hoverIndex,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const theme = useTheme();

  const adminMenuList = [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
    },
    {
      label: "Employees",
      icon: <BadgeOutlinedIcon />,
      path: "/manage-employees",
    },
    {
      label: "Internees",
      icon: <AssignmentIndIcon />,
      path: "/manage-internees",
    },
    {
      label: "Salary",
      icon: <PaymentOutlined />,
      path: "/pay-salaries",
      collapsable: true,
      open: false,
      children: [
        {
          label: "Generate Salary",
          path: "/pay-salaries",
        },
        {
          label: "Salary Report",
          path: "/manage-salaries",
        },
        {
          label: "Advance Applications",
          path: "/advance-applications",
        },
      ],
    },
    {
      label: "Employee Documents",
      icon: <FolderIcon />,
      path: "/pay-salaries",
      collapsable: true,
      open: false,
      children: [
        {
          label: "Upload Documents",
          path: "/uploadDocuments",
        },
      ],
    },
    {
      label: "Teams",
      icon: <GroupsIcon />,
      path: "/create-team",
      collapsable: true,
      open: false,
      children: [
        {
          label: "Create Team",
          path: "/create-team",
        },
        {
          label: "Teams",
          path: "/teams",
        }
      ],
    },

    {
      label: "Interview Evaluation",
      icon: <PersonSearchOutlined sx={{ fontSize: "1.4rem" }} />,
      path: "/interview-evaluation",
    },
    {
      label: "Role",
      icon: <ManageAccountsOutlined sx={{ fontSize: "1.4rem" }} />,
      path: "/role",
    },
    {
      label: "All Portfolio",
      icon: <PermMediaOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      path: "/all-portfolio-page",
    },
    {
      label: "Company Data",
      icon: <BusinessOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      collapsable: true,
      children: [
        {
          label: "Documents",
          path: "/tax",
        },
        {
          label: "Revenue",
          path: "/tax",
        },
        {
          label: "Profit",
          path: "/tax",
        },
      ],
    },
    {
      label: "Task Manager",
      icon: <AssignmentOutlined sx={{ fontSize: "1.4rem" }} />,
      collapsable: true,
      children: [
        {
          label: "Assign Task",
          path: "/assignTask",
        },
        {
          label: "All Task",
          path: "/all-tasks",
        },
      ],
    },
    {
      label: "Employee Of Week",
      icon: <EmojiEventsOutlined sx={{ fontSize: "1.2rem" }} />,
      collapsable: true,
      children: [
        {
          label: "Daily Report Form",
          path: "/employeedailyreportform",
        },
        {
          label: "Perfomance Analytics",
          path: "/performanceAnalytics",
        },
        {
          label: "History",
          path: "/eowhistory",
        },
      ],
    },
    {
      label: "Leaves",
      icon: <DoorFrontOutlined sx={{ fontSize: "1.4rem" }} />,

      collapsable: true,
      children: [
        {
          label: "Manager Leaves",
          path: "/Manager-leaves",
        },
        {
          label: "Employee Leaves",
          path: "/Employee-leavesHistory",
        },
        {
          label: "Leave History",
          path: "/leaveHistory",
        },
      ],
    },
  ];
  const managerMenuList = [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
    },
    {
      label: "Employees",
      icon: <BadgeOutlinedIcon />,
      path: "/manage-employees",
    },
    {
      label: "Internees",
      icon: <AssignmentIndIcon />,
      path: "/manage-internees",
    },
    {
      label: "Interview Evaluation",
      icon: <PersonSearchOutlined sx={{ fontSize: "1.4rem" }} />,
      path: "/interview-evaluation",
    },
    {
      label: "My Performance",
      icon: <AssessmentOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      path: "/performance",
    },
    {
      label: "All Portfolio",
      icon: <PermMediaOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      path: "/all-portfolio-page",
      collapsable: true,
      children: [
        {
          label: "My Portfolio",
          path: `/portfolio/${currentUser._id}`,
        },
        {
          label: "All Portfolio",
          path: "/all-portfolio-page",
        },
      ],
    },

    {
      label: "Task Manager",
      icon: <AssignmentOutlined sx={{ fontSize: "1.4rem" }} />,
      collapsable: true,
      children: [
        {
          label: "Assign Task",
          path: "/assignTask",
        },
        {
          label: "All Task",
          path: "/all-tasks",
        },
      ],
    },

    {
      label: "Employee Of Week",
      icon: <EmojiEventsOutlined sx={{ fontSize: "1.2rem" }} />,
      collapsable: true,
      children: [
        {
          label: "Daily Report Form",
          path: "/employeedailyreportform",
        },
        //   {
        //     label: "Perfomance Analytics",
        //     path: "/performanceAnalytics",
        //   },
        //   {
        //     label: "History",
        //     path: "/eowhistory",
        //   },
      ],
    },
    {
      label: "Payments",
      icon: <PaymentOutlined />,
      path: "/pay-salaries",
      collapsable: true,
      open: false,
      children: [
        {
          label: "Advance Payments",
          path: "/advance-payments",
        },
        {
          label: "Applications",
          path: "/advance-applications",
        },
      ],
    },

    {
      label: "All Leaves",
      icon: <DoorFrontOutlined sx={{ fontSize: "1.4rem" }} />,
      collapsable: true,
      children: [
        { label: "Apply For Leave", path: "/leave-form" },
        { label: "My Leaves", path: "/my-leaves" },
        { label: "Employee Leaves", path: "/employee-leaves" },
        {
          label: "Leave History",
          path: "/leaveHistory",
        },
      ],
    },
  ];

  const employeeMenuList = [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
    },
    {
      label: "My Performance",
      icon: <AssessmentOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      path: "/performance",
    },
    {
      label: "Portfolio",
      icon: <PermMediaOutlinedIcon sx={{ fontSize: "1.4rem" }} />,
      path: `/portfolio/${currentUser._id}`,
    },
    {
      label: "Tasks",
      icon: <AssignmentOutlined />,
      path: `/employeetaskboard/${currentUser._id}`,
    },
    {
      label: "Payments",
      icon: <PaymentOutlined />,
      path: "/pay-salaries",
      collapsable: true,
      open: false,
      children: [
        {
          label: "Advance Payments",
          path: "/advance-payments",
        },
        {
          label: "Applications",
          path: "/advance-applications",
        },
      ],
    },

    {
      label: "Leaves",
      icon: <MeetingRoomIcon sx={{ fontSize: "1.4rem" }} />,
      collapsable: true,
      children: [
        { label: "Apply For Leave", path: "/leave-form" },
        { label: "My Leaves", path: "/my-leaves" },
        {
          label: "Leave History",
          path: "/leaveHistory",
        },
      ],
    },
  ];

  useEffect(() => {
    if (isSmallScreen) {
      handleMouseEnter();
    }
  });

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const greaterthanlg = useMediaQuery(theme.breakpoints.up("lg"));
  const role = currentUser?.role;

  return (
    <>
      {role === "admin" && (
        <DynamicMenu
          greaterthanlg={greaterthanlg}
          menuList={adminMenuList}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          handleMouseLeave={handleMouseLeave}
          handleMouseEnter={handleMouseEnter}
          hoverIndex={hoverIndex}
          mobileOpen={mobileOpen}
        />
      )}
      {role === "manager" && (
        <DynamicMenu
          menuList={managerMenuList}
          greaterthanlg={greaterthanlg}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          handleMouseLeave={handleMouseLeave}
          handleMouseEnter={handleMouseEnter}
          hoverIndex={hoverIndex}
          mobileOpen={mobileOpen}
        />
      )}
      {role === "employee" && (
        <DynamicMenu
          greaterthanlg={greaterthanlg}
          menuList={employeeMenuList}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          handleMouseLeave={handleMouseLeave}
          handleMouseEnter={handleMouseEnter}
          hoverIndex={hoverIndex}
          mobileOpen={mobileOpen}
        />
      )}
    </>
  );
};

Navbar.propTypes = {
  drawerWidth: PropTypes.any,
  mobileOpen: PropTypes.any,
  handleDrawerToggle: PropTypes.any,
  handleMouseLeave: PropTypes.any,
  handleMouseEnter: PropTypes.any,
  hoverIndex: PropTypes.any,
};

export default Navbar;
