import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActiveEmployeesTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  return <div>ActiveEmployeesTable</div>;
};

export default ActiveEmployeesTable;
