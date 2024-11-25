import "./index.css";
import { useEffect } from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import {
  setCelebrationData,
  setShowCelebration,
} from "./redux/celebrationSlice";

import AddFiles from "./pages/Tax/AddFiles";
import AddTax from "./pages/Tax/AddTax";
import AdvanceApplications from "./pages/Salary/AdvanceApplications";
import AdvancePayment from "./pages/Salary/AdvancePayment";
import AllLeaves from "./pages/Leaves/AllLeaves";
import AllPortfolio from "./pages/Portfolio/AllPortfolio";
import AllPortfolioEmployees from "./pages/Portfolio/AllPortfolioEmployees";
import AllPortfolioPage from "./pages/Portfolio/AllPortfolioPage";
import Celebration from "./pages/Celebration"; // Import your Celebration component
import CreateEmployeeForm from "./pages/ManageEmployee/CreateEmployeeForm";
import CreateInterneeForm from "./pages/ManageEmployee/CreateInterneeForm";
import CreateProject from "./pages/Portfolio/CreateProject";
import UpdateEmployee from "./pages/ManageEmployee/UpdateEmployee";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeDailyReportForm from "./pages/EmployeeOfTheWeek/EmployeeDailyReportForm";
import EmployeeLeaves from "./pages/Leaves/EmployeeLeaves";
import EmployeePerformance from "./pages/EmployeeOfTheWeek/EmployeePerformance";
import EmployeeProfile from "./pages/ManageEmployee/EmployeeProfile";
import EmployeeTask from "./pages/TaskModule/EmployeeTaskModule/EmployeeTask";
import EmployeeTaskBoard from "./pages/TaskModule/EmployeeTaskModule/EmployeeTaskBoard";
import EmployeeTaskForm from "./pages/TaskModule/EmployeeTaskModule/EmployeeTaskForm";
import EmployeeTasksViewPause from "./pages/TaskModule/EmployeeTaskModule/EmployeeTasksViewPause";
import EvaluationPage from "./pages/InterviewEvaluation/EvaluationPage";
import InterneeEvaluation from "./pages/InterviewEvaluation/InterneeEvaluation";
import InterneeProfile from "./pages/ManageEmployee/InterneeProfile";
import InterviewEvalForm from "./pages/InterviewEvaluation/InterviewEvalForm";
import LeaveForm from "./pages/Leaves/LeaveForm";
import ManageEmployees from "./pages/ManageEmployee/ManageEmployees";
import ManageSalary from "./pages/Salary/ManageSalary";
import MyLeaves from "./pages/Leaves/MyLeaves";
import NotFound from "./pages/NotFound";
import PaySalaries from "./pages/Salary/PaySalaries";
import Portfolio from "./pages/Portfolio/Portfolio";
import PrivateRoutes from "./components/PrivateRoute";
import Project from "./pages/Portfolio/Project";
import Role from "./pages/Role Manager/Role";
import Salary from "./pages/Salary/Salary";
import Signin from "./pages/Sigin";
import Tax from "./pages/Tax/Tax";
import TaxFileView from "./pages/Tax/TaxFileView";
import TaxFiles from "./pages/Tax/TaxFiles";
import History from "./pages/EmployeeOfTheWeek/EowHistory";
import Unauthorized from "./pages/Unauthorized";
import UpdateTax from "./pages/Tax/UpdateTax";
import ViewLeave from "./pages/Leaves/ViewLeave";
import ViewPerformance from "./pages/Performance/ViewPerformance";
import { clearSocket } from "./redux/socketSlice";
import { initializeSocket } from "../src/redux/socketSlice";
import { signOut } from "./redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useMessage } from "./components/MessageContext";
import { useSelector } from "react-redux";
import EmployeeTaskTableCom from "./pages/TaskModule/EmployeeTaskModule/EmployeeTaskTableCom";
import { Toaster } from "react-hot-toast";
const App = () => {
  const socket = useSelector((state) => state.socket.socket);
  const { currentUser } = useSelector((state) => state.user);
  const { message, hideMessage } = useMessage();
  const celebrationData = useSelector(
    (state) => state.celebration.celebrationData
  );
  const showCelebration = useSelector(
    (state) => state.celebration.showCelebration
  );

  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideMessage();
  };

  useEffect(() => {
    if (socket) {
      socket.on("celebration", (data) => {
        //console.log("data",data)
        dispatch(setCelebrationData(data));
        dispatch(setShowCelebration(true));
      });
      return () => {
        socket.off("celebration", (data) => {
          // console.log(`Employee of the Week: ${data.employee} with ${data.points} points!`);
        });
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);

  useEffect(() => {
    const signOutTimer = setTimeout(() => {
      dispatch(clearSocket());
      localStorage.removeItem("persist:user");
      dispatch(signOut());
      // navigate("/login");
      // Example: Call a sign-out function or update state to sign the user out
    }, 8 * 60 * 60 * 1000); // 60 seconds in milliseconds

    return () => clearTimeout(signOutTimer);
  }, []);

  return (
    <>
      {showCelebration && (
        <Celebration
          name={celebrationData?.name}
          points={celebrationData?.points}
          onClose={() => dispatch(setShowCelebration(false))}

          //onClose={() => setShowCelebration(false)} // Callback to close celebration
        />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Signin />} />

          <Route
            element={<PrivateRoutes allowedRoles={["manager", "employee"]} />}
          >
            {/* Leave Routes */}
            <Route path="/my-leaves" element={<MyLeaves />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/leave-form" element={<LeaveForm />} />
            {/* Performance Routes */}
            <Route path="/performance" element={<ViewPerformance />} />
          </Route>

          <Route
            element={
              <PrivateRoutes allowemployee-leavesedRoles={["employee"]} />
            }
          >
            <Route path="/all-portfolio" element={<AllPortfolio />} />
          </Route>

          <Route
            element={<PrivateRoutes allowedRoles={["admin", "manager"]} />}
          >
            <Route path="/manage-employees" element={<ManageEmployees />} />
            <Route path="/create-employee" element={<CreateEmployeeForm />} />
            <Route path="/create-internee" element={<CreateInterneeForm />} />
            <Route
              path="/update-employee-profile/:id"
              element={<UpdateEmployee />}
            />
            {/* Interview Routes */}
            <Route
              path="/interview-evaluation"
              element={<InterneeEvaluation />}
            />

            <Route path="/evaluation-form" element={<InterviewEvalForm />} />
            <Route path="/evaluation-page/:id" element={<EvaluationPage />} />
            <Route path="/internee-profile/:id" element={<InterneeProfile />} />

            {/* Portfolio Routes */}
            <Route
              path="/all-portfolio-employees"
              element={<AllPortfolioEmployees />}
            />
            <Route path="/all-portfolio-page" element={<AllPortfolioPage />} />

            {/* Task Routes */}
            <Route path="/assignTask" element={<EmployeeTaskForm />} />
            <Route path="/all-tasks" element={<EmployeeTask />} />

            {/* Task Routes */}
            <Route
              path="/employeetaskviewPause/:empid"
              element={<EmployeeTasksViewPause />}
            />

            {/* ========================= testing prupose */}

            <Route path="/newtasktable" element={<EmployeeTaskTableCom />} />
            {/* ===================== */}

            {/* employee of the week Routes */}
            <Route
              path="/employeedailyreportform"
              element={<EmployeeDailyReportForm />}
            />

            <Route path="/eowhistory" element={<History />} />
          </Route>

          <Route
            element={
              <PrivateRoutes allowedRoles={["admin", "manager", "employee"]} />
            }
          >
            <Route path="/" element={<Dashboard />} />

            {/* Employee Routes */}

            <Route path="/employee-profile/:id" element={<EmployeeProfile />} />

            <Route
              path="/employeetaskboard/:id"
              element={<EmployeeTaskBoard />}
            />

            <Route
              path="/performanceAnalytics"
              element={<EmployeePerformance />}
            />

            {/* Portfolio Routes */}
            <Route path="/project/:id" element={<Project />} />
            <Route path="/portfolio/:id" element={<Portfolio />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/all-portfolio-page" element={<AllPortfolioPage />} />
            <Route path="/all-portfolio" element={<AllPortfolio />} />

            {/* Tax Routes */}
            <Route path="/tax" element={<Tax />} />
            <Route path="/add-tax" element={<AddTax />} />
            <Route path="/update-tax/:id" element={<UpdateTax />} />
            <Route path="/tax-files/:id" element={<TaxFiles />} />
            <Route path="/add-files" element={<AddFiles />} />
            <Route path="/tax-file-view/:id" element={<TaxFileView />} />
            <Route path="/tax-file-view/:id" element={<TaxFileView />} />

            {/* Task Routes */}
            <Route path="/assignTask" element={<EmployeeTaskForm />} />
            <Route
              path="/employeetaskboard/:id"
              element={<EmployeeTaskBoard />}
            />
            <Route path="/all-tasks" element={<EmployeeTask />} />
            <Route
              path="/employeetaskviewPause/:empid"
              element={<EmployeeTasksViewPause />}
            />

            {/* Salary Routes */}
            <Route path="/pay-salaries" element={<PaySalaries />} />
            <Route path="/salary/:id" element={<Salary />} />
            <Route path="/manage-salaries" element={<ManageSalary />} />
            <Route path="/advance-payments" element={<AdvancePayment />} />
            <Route
              path="/advance-applications"
              element={<AdvanceApplications />}
            />

            {/* Leave Routes */}
            <Route path="/leave-form" element={<LeaveForm />} />
            <Route path="/my-leaves" element={<MyLeaves />} />
            <Route path="/employee-leaves" element={<EmployeeLeaves />} />
            <Route path="/all-leaves" element={<AllLeaves />} />
            <Route path="/view-leave/:id" element={<ViewLeave />} />

            {/* employee of the week Routes */}
            <Route
              path="/employeedailyreportform"
              element={<EmployeeDailyReportForm />}
            />
            <Route
              path="/performanceAnalytics"
              element={<EmployeePerformance />}
            />
            {/* Role Routes */}
            <Route path="/role" element={<Role />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        toastOptions={{
          style: {
            maxWidth: "600px",
          },
        }}
      />

      {/* <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ mt: 9, mr: 1 }}
      >
        <Alert
          onClose={handleClose}
          severity={message?.type || "info"}
          sx={{ width: "100%" }}
        >
          {message?.text || ""}
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default App;
