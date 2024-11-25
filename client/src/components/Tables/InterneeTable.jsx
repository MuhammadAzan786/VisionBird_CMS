import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import EmployeeNameCell from "../Grid Cells/EmployeeProfileCell";
import PropTypes from "prop-types";

const InterneeTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [internees, setInternees] = useState([]);

  const navigateTo = (internee) => {
    navigate(`/internee-profile/${internee.id}`);
  };

  const fetchInternees = async () => {
    try {
      const response = await axios.get(
        `/api/internee/get_internees?search=${searchTerm}||""`
      );
      setInternees(response.data);
    } catch (error) {
      console.error("Error fetching internee data:", error.message);
    }
  };

  useEffect(() => {
    fetchInternees();
  }, [searchTerm]);

  const interneeColumns = [
    {
      field: "firstName",
      headerName: "Internee",
      width: 300,
      // src={row.interneeProImage} fix internee image issue, image is not uploading
      renderCell: ({ row }) => (
        <EmployeeNameCell userId={row.internId} name={row.firstName} />
      ),
    },
    { field: "email", headerName: "Email", width: 260 },
    {
      field: "internshipFrom",
      headerName: "Internship From",
      width: 200,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.internshipFrom).format("MMMM D, YYYY")}
        </Typography>
      ),
    },
    {
      field: "internshipTo",
      headerName: "Internship To",
      width: 200,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.internshipTo).format("MMMM D, YYYY")}
        </Typography>
      ),
    },
    { field: "designation", headerName: "Designation", width: 250 },
    { field: "offered_By", headerName: "Offered by", width: 100 },
    {
      field: "givenOn",
      headerName: "Given On",
      width: 300,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.givenOn).format("dddd, MMMM D, YYYY")}
        </Typography>
      ),
    },
  ];

  return (
    <DataGrid
      rows={internees.map((internee) => ({
        ...internee,
        id: internee._id,
      }))}
      columns={interneeColumns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 20]}
      onRowDoubleClick={navigateTo}
      pagination
      autoPageSize
      sx={{ cursor: "pointer" }}
    />
  );
};

InterneeTable.propTypes = {
  searchTerm: PropTypes.any,
};
export default InterneeTable;
