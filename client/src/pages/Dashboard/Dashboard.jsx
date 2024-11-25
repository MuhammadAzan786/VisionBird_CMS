import { useSelector } from "react-redux";
import Admin from "./Admin";
import Manager from "./Manager";
import Employee from "./Employee";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  return (
    <>
      {role === "admin" && <Admin />}
      {role === "manager" && <Manager />}
      {role === "employee" && <Employee />}
    </>
  );
};

export default Dashboard;