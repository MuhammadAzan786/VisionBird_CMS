import { Navigate, Outlet } from "react-router-dom";
import Sidenav from "./Sidenav&AppBar/Sidenav";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);

  if (isAuthenticated === true && allowedRoles.includes(currentUser.role)) {
    return (
      <>
        <Sidenav>
          <Outlet />
        </Sidenav>
      </>
    );
  } else if (
    isAuthenticated === true &&
    !allowedRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/unauthorized" />;
  } else {
    return <Navigate to="/login" />;
  }
};

PrivateRoutes.propTypes = {
  allowedRoles: PropTypes.any,
};

export default PrivateRoutes;
