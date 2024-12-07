import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "../../utils/axiosInterceptor";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { CustomChip } from "../../components/Styled/CustomChip";
import { WordCaptitalize } from "../../utils/common";

import {
  Avatar,
  Box,
  IconButton,
  FormControl,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Menu,
  Skeleton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Select,
  Paper,
} from "@mui/material";
import { customColors } from "../../theme/colors";

function Role() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [employeesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState({
    employeeName: true,
    email: true,
    role: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  const handleOpenDialog = (employee) => {
    setDialogContent(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeRole = (event) => {
    setDialogContent((prev) => ({ ...prev, role: event.target.value }));
  };

  const getEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/all_employees");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/employee/delete_employee/${id}`);
        if (response.status === 200) {
          alert("Profile deleted successfully.");
          setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== id));
          handleCloseDialog();
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("There was an error deleting the profile. Please try again later.");
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDialogContent((prev) => ({
          ...prev,
          profileImage: reader.result,
          employeeProImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEmployee = async (employee) => {
    const { _id, ...updatedEmployee } = employee;

    if (!_id) {
      console.error("Employee ID is undefined");
      Swal.fire("Failed!", "Employee ID is missing.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("employeeProImage", updatedEmployee.employeeProImage);
    formData.append("employeeName", updatedEmployee.employeeName);
    formData.append("email", updatedEmployee.email);
    formData.append("role", updatedEmployee.role);

    try {
      const response = await axios.patch(`/api/employee/update_employee/${_id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      Swal.fire("Updated!", `${employee.employeeName}'s role updated.`, "success");
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      Swal.fire("Failed!", "Updation failed.", "error");
    }
  };

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        (filterField.employeeName && employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (filterField.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (filterField.role && employee.role.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, filterField]);

  useEffect(() => {
    getEmployees();
  }, []);

  const indexOfLastEmployee = (currentPage + 1) * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  const openFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setAnchorEl(null);
  };

  const handleFieldFilterChange = (field) => {
    setFilterField((prevField) => ({
      ...prevField,
      [field]: !prevField[field],
    }));
  };

  return (
    <>
      {/* Search Bar and Filter */}
      <Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            sx={{ mb: { xs: 2, sm: 0 }, width: "100%" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton onClick={openFilterMenu} aria-label="filter">
            <FilterListIcon sx={{ color: "#00AFEF" }} />
          </IconButton>
        </Box>
      </Paper>

      {/* Filter Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeFilterMenu}>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox checked={filterField.employeeName} onChange={() => handleFieldFilterChange("employeeName")} />
            }
            label="Employee Name"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Checkbox checked={filterField.email} onChange={() => handleFieldFilterChange("email")} />}
            label="Email"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Checkbox checked={filterField.role} onChange={() => handleFieldFilterChange("role")} />}
            label="Role"
          />
        </MenuItem>
      </Menu>

      {/* Table Container */}
      <Paper>
        <TableContainer
          sx={{
            padding: 0,
            overflowX: "auto",
            marginTop: "1rem",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
              <TableRow>
                {["User", "Email", "Role", "Action"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="text" width="100%" height={50} />
                    <Skeleton variant="text" width="100%" height={50} />
                    <Skeleton variant="text" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              ) : currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        <Avatar alt={employee.employeeName} src={employee.employeeProImage?.secure_url} />
                        <Typography sx={{ fontSize: { xs: 13, sm: 16 }, fontWeight: 600 }}>
                          {employee.employeeName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: { xs: 13, sm: 16 }, fontWeight: 400 }}>{employee.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <CustomChip label={WordCaptitalize(employee.role)} size="small" status={employee.role} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "12px" }}>
                        {/* View Profile Button */}
                        <IconButton
                          onClick={() => {
                            navigate(`/employee-profile/${employee._id}`);
                          }}
                          sx={{
                            backgroundColor: (theme) => customColors.greenAlpha,
                            padding: "8px",
                            transition: "background-color 0.3s ease, transform 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#FFE3E2", // Subtle change on hover
                              transform: "scale(1.06)",
                            },
                          }}
                        >
                          <VisibilityIcon
                            sx={{
                              color: (theme) => customColors.green,
                              fontSize: "22px",
                            }}
                          />
                        </IconButton>

                        {/* Edit Button */}
                        <IconButton
                          onClick={() => handleOpenDialog(employee)}
                          aria-label="edit"
                          sx={{
                            backgroundColor: (theme) => customColors.redAlpha,
                            padding: "8px",
                            transition: "background-color 0.3s ease, transform 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#E8FADD", // Subtle change on hover
                              transform: "scale(1.06)",
                            },
                          }}
                        >
                          <EditNoteIcon
                            sx={{
                              color: (theme) => customColors.red,
                              fontSize: "22px",
                            }}
                          />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography>No employees found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <ReactPaginate
          previousLabel={<ArrowBackIcon />}
          nextLabel={<ArrowForwardIcon />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredEmployees.length / employeesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </Box>

      {/* Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogContent
          sx={{
            padding: "0",
            overflow: "hidden",
          }}
        >
          {/* Profile cover */}
          <Box
            sx={{
              backgroundColor: "#00AFEF",
              height: { xs: "100px", sm: "120px" },
              borderRadius: "8px 8px 0 0",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Background image (optional) */}
            {/* <img src="/path/to/cover-image.jpg" alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
          </Box>

          {/* Avatar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              top: "-40px",
              zIndex: 1,
            }}
          >
            <Avatar
              alt={dialogContent.employeeName}
              src={dialogContent.employeeProImage?.secure_url}
              sx={{
                width: { xs: 72, sm: 100 },
                height: { xs: 72, sm: 100 },
                border: "3px solid #fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />

            {/* Name & Email & Profile Button*/}
            <Box sx={{ textAlign: "center", marginTop: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {dialogContent.employeeName || "User Name"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {dialogContent.email || "user@example.com"}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00AFEF",
                  color: "#fff",
                  fontWeight: 500,
                  marginTop: "10px",
                  "&:hover": { backgroundColor: "#008CCC" },
                }}
                onClick={() => {
                  navigate(`/employee-profile/${dialogContent._id}`);
                }}
              >
                View Profile
              </Button>
            </Box>
          </Box>

          {/* Main content */}
          <Box
            sx={{
              padding: { xs: "0 8px 8px 8px", sm: "0 16px 16px 16px" },
              paddingTop: "0",
              marginBottom: "0",
            }}
          >
            {/* Form inputs */}
            <Box sx={{ marginTop: "24px" }}>
              {/* Name Input */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3,
                  borderTop: "1px solid #e1e1e1",
                  paddingTop: "12px",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Name
                </Typography>
                <TextField
                  margin="dense"
                  type="text"
                  sx={{ minWidth: 200 }}
                  value={dialogContent.employeeName || ""}
                  onChange={(e) =>
                    setDialogContent({
                      ...dialogContent,
                      employeeName: e.target.value,
                    })
                  }
                />
              </Box>

              {/* Email Input */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3,
                  borderTop: "1px solid #e1e1e1",
                  paddingTop: "12px",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Email
                </Typography>
                <TextField
                  margin="dense"
                  type="email"
                  sx={{ minWidth: 200 }}
                  value={dialogContent.email || ""}
                  onChange={(e) =>
                    setDialogContent({
                      ...dialogContent,
                      email: e.target.value,
                    })
                  }
                />
              </Box>

              {/* Role Select */}
              <FormControl
                fullWidth
                sx={{
                  marginBottom: 3,
                  borderTop: "1px solid #e1e1e1",
                  paddingTop: "12px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Role
                  </Typography>
                  <Select value={dialogContent.role || ""} onChange={handleChangeRole} sx={{ minWidth: 150 }}>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </Box>
              </FormControl>

              {/* Profile Picture Upload */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 3,
                  borderTop: "1px solid #e1e1e1",
                  paddingTop: "12px",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Profile Picture
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <Avatar
                    src={dialogContent.profileImage}
                    alt="Profile"
                    sx={{ width: 56, height: 56, border: "1px solid #e1e1e1" }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{
                      padding: "8px",
                      color: "#fff",
                      backgroundColor: "#00AFEF",
                      fontWeight: "500",
                      "&:hover": { backgroundColor: "#008CCC" },
                    }}
                  >
                    Replace
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            borderTop: "1px solid #e1e1e1",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => handleDelete(dialogContent._id)}
            sx={{
              padding: "8px",
              backgroundColor: "#FFE3E2",
              color: "#FF4D49",
              fontWeight: "700",
              "&:hover": {
                backgroundColor: "#FF4D49",
                color: "#FFE3E2",
              },
            }}
          >
            Delete User
          </Button>

          <Box sx={{ display: "flex", gap: "20px" }}>
            <Button variant="outlined" onClick={handleCloseDialog} sx={{ fontWeight: "500", padding: "8px" }}>
              Cancel
            </Button>

            <Button
              startIcon={<SaveIcon />}
              onClick={() => updateEmployee(dialogContent)}
              sx={{
                padding: "8px",
                color: "#fff",
                backgroundColor: "#00AFEF",
                fontWeight: "500",
                "&:hover": { backgroundColor: "#008CCC" },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Role;
