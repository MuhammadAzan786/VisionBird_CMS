import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Backdrop, Box, Button, Grid, InputLabel, MenuItem, Modal, Paper, Select, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { object, string } from "yup";
import LoadingAnim from "../../components/LoadingAnim";
import UploadFiles from "../../components/upload/UploadFiles";
import "../../index.css";
import axios from "../../utils/axiosInterceptor";
import Test from "../Test/Test";
import { ScrollToErrorField } from "../../utils/common";
import { useWindowCloseHandler } from "../../hooks/useWindowCloseHandler";
const validationSchema = object().shape({
  firstName: string()
    .required("Required Name")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters and spaces are allowed"),

  fatherName: string()
    .required("Required Name")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters are allowed"),
  cnic: string()
    .required("Required CNIC")
    .test("format", "CNIC must be in the format XXXXX-XXXXXXX-X", (value) => /^\d{5}-\d{7}-\d$/.test(value || "")),

  dob: string().required("Enter Date"),
  mailingAddress: string().required("Enter Mailing Address"),
  disability: string().required("Required Field"),
  kindofdisability: string().matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters and spaces are allowed"),
  mobile: string()
    .required("Required Field")
    .test("format", "Mobile must be in the format 03XX-XXXXXXX", (value) => /^03\d{2}-\d{7}$/.test(value || "")),
  email: string().email().required("Required Email"),
  gender: string().required("Required Field"),
  maritalStatus: string().required("Required Field"),
  otherMobile: string()
    .required("Required Field")
    .test("format", "Mobile must be in the format 03XX-XXXXXXX", (value) => /^03\d{2}-\d{7}$/.test(value || "")),
  whosMobile: string()
    .required("Required Name")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters and spaces are allowed"),
  qualification: string().required("Required Field"),
  startDate: string().required("Date Required"),
  probation: string().required("Please select "),
  empCard: string().required("Required Field"),
  bankAccount: string().required("Required Field"),
  empId: string().required("Required Field"),
  designation: string().required("Required Field"),
  userName: string().required("Required Field"),
  password: string().required("Required Field"),
  role: string().required("Required Field"),
});

function UpdateForm() {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  const { id } = useParams();

  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);

  const tempFilesRef = useRef([]);
  const deletedFilesRef = useRef([]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };
  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  // Custom Hook to prevent WindowClose
  useWindowCloseHandler(tempFilesRef);

  useEffect(() => {
    axios
      .get(`/api/employee/get_employee/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log("Update data", response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <Formik
      initialValues={{
        firstName: user.employeeName || "",
        fatherName: user.employeeFatherName || "",
        cnic: user.employeeCNIC || "",
        dob: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        mailingAddress: user.mailingAddress || "",
        disability: user.disability || "",
        kindofdisability: user.disabilityType || "",
        mobile: user.mobileNumber || "",
        email: user.email || "",
        gender: user.gender || "",
        maritalStatus: user.maritalStatus || "",
        otherMobile: user.guardiansMobileNumber || "",
        whosMobile: user.whosMobile || "",
        qualification: user.qualification || "",
        startDate: user.dateOfJoining ? user.dateOfJoining.split("T")[0] : "",
        endDate: user.dateConfirmed ? user.dateConfirmed.split("T")[0] : "",
        probation: user.probationPeriod || "",
        probationMonths: user.probationMonth || "",
        policyBook: user.policyBookSigned || "",
        appointment: user.appointmentLetterGiven || "",
        rules: user.rulesAndRegulationsSigned || "",
        annualLeave: user.annualLeavesSigned || "",

        attendence: user.attendanceBiometric || "",
        localServerAccount: user.localServerAccountCreated || "",
        superAdmin: user.superAdmin || "",
        slack: user.addedInSlack || "",
        whatsApp: user.addedInWhatsApp || "",
        empCard: user.employeeCardGiven || "",
        bankAccount: user.bankAccount || "",
        // newBank: '',
        accountNo: user.bankAccountNumber || "",
        // covid: user.employeeName || '',

        empId: user.employeeID || "",
        designation: user.employeeDesignation || "",
        BasicPayInProbationPeriod: user.BasicPayInProbationPeriod || 0,
        BasicPayAfterProbationPeriod: user.BasicPayAfterProbationPeriod || 0,
        AllowancesInProbationPeriod: user.AllowancesInProbationPeriod || 0,
        AllowancesAfterProbationPeriod: user.AllowancesAfterProbationPeriod || 0,
        userName: user.employeeUsername || "",
        password: user.employeePassword || "",
        role: user.role || "",
        // ======= Documents
        employeeProImage: user.employeeProImage || {},
        degreesScanCopy: user.degreesScanCopy || [],
        cnicScanCopy: user.cnicScanCopy || [],
        policeCertificateUpload: user.policeCertificateUpload || [],
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const fieldMap = {
          employeeName: values.firstName,
          employeeFatherName: values.fatherName,
          employeeCNIC: values.cnic,
          dateOfBirth: values.dob,
          mailingAddress: values.mailingAddress,
          mobileNumber: values.mobile,
          guardiansMobileNumber: values.otherMobile,
          email: values.email,
          maritalStatus: values.maritalStatus,
          gender: values.gender,
          disability: values.disability,
          disabilityType: values.kindofdisability,
          qualification: values.qualification,
          dateOfJoining: values.startDate,
          dateConfirmed: values.endDate,
          probationPeriod: values.probation,
          probationPeriodStartDate: values.startDate,
          probationPeriodEndDate: values.endDate,
          policyBookSigned: values.policyBook,
          appointmentLetterGiven: values.appointment,
          rulesAndRegulationsSigned: values.rules,
          annualLeavesSigned: values.annualLeave,

          attendanceBiometric: values.attendence,
          localServerAccountCreated: values.localServerAccount,
          role: values.role,
          addedInSlack: values.slack,
          addedInWhatsApp: values.whatsApp,
          employeeCardGiven: values.empCard,
          bankAccount: values.bankAccount,
          bankAccountNumber: values.accountNo,

          employeeID: values.empId,
          employeeDesignation: values.designation,
          BasicPayInProbationPeriod:
            values.probation === "yes" ? values.BasicPayInProbationPeriod || 0 : user.BasicPayInProbationPeriod,
          BasicPayAfterProbationPeriod: values.BasicPayAfterProbationPeriod || 0,
          AllowancesInProbationPeriod:
            values.probation === "yes" ? values.AllowancesInProbationPeriod || 0 : user.AllowancesInProbationPeriod,
          AllowancesAfterProbationPeriod: values.AllowancesAfterProbationPeriod || 0,
          employeeUsername: values.userName,
          employeePassword: values.password,

          // ======= Documents
          employeeProImage: values.employeeProImage,
          cnicScanCopy: values.cnicScanCopy,
          policeCertificateUpload: values.policeCertificateUpload,
          degreesScanCopy: values.degreesScanCopy,
        };

        console.log("Data to Submit", fieldMap);

        await axios
          .patch(`/api/employee/update_employee/${id}`, {
            updateData: fieldMap,
            deletedFiles: deletedFilesRef.current,
          })
          .then(() => {
            setLoading(false);
            toast.success("Employee Updated Successfully!");
            navigate("/manage-employees");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error("error", "Employee Creation failed!");
          });
      }}
    >
      {({ values, setFieldValue, handleSubmit, errors, setTouched }) => (
        <Box m={5}>
          <Grid ml={2}>
            <Form className=" my-5 ">
              {/* //Personal info */}
              <Grid container spacing={2} component={Paper} elevation={2} sx={{ borderRadius: "5px" }} p={3} mt={2}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#3b4056",
                      mb: 1,
                    }}
                  >
                    Personal Info
                  </Typography>
                  <hr style={{ marginBottom: "10px" }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Field
                    label="Name"
                    component={TextField}
                    name="firstName"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(keyValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    label="Father Name"
                    component={TextField}
                    name="fatherName"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(keyValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="Date Of Birth"
                    InputLabelProps={{ shrink: true }}
                    component={TextField}
                    name="dob"
                    type="date"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    label="CNIC"
                    component={TextField}
                    name="cnic"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    placeholder="XXXXX-XXXXXXX-X"
                    onInput={(event) => {
                      const input = event.target.value;
                      const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedCnic = formattedInput
                        .replace(/(.{5})(.?)/, "$1-$2") // Add dash after the fifth character
                        .replace(/(.{13})(.?)/, "$1-$2"); // Add dash before the last character
                      event.target.value = formattedCnic;
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Field
                      name="gender"
                      as={Select}
                      labelId="gender-label"
                      label="Gender"
                      value={values.gender} // Bind gender to Formik state
                      onChange={(event) => {
                        setFieldValue("gender", event.target.value); // Update Formik value
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Field>
                    <ErrorMessage name="gender" component="div" style={{ color: "red" }} />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="marital_status">Marital Status</InputLabel>
                      <Field fullWidth name="maritalStatus" label="Marital Status" labelId="marital_status" as={Select}>
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                        <MenuItem value="divorced">Divorced</MenuItem>
                        <MenuItem value="widowed">Widowed</MenuItem>
                      </Field>
                      <ErrorMessage name="maritalStatus" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="qualification-label">Qualification</InputLabel>
                      <Field name="qualification" as={Select} labelId="qualification-label" label="Qualification">
                        <MenuItem value="matriculation">Matriculation</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="graduation">Graduation</MenuItem>
                        <MenuItem value="masters">Masters</MenuItem>
                      </Field>
                      <ErrorMessage name="qualification" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "5px",
                            },
                          }}
                        >
                          <InputLabel id="disability-label">Disability</InputLabel>
                          <Field name="disability" as={Select} labelId="disability-label" label="Disability">
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Field>
                          <ErrorMessage name="disability" style={{ color: "red" }} component="div" />
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Field
                        label="What Kind of Disability?"
                        component={TextField}
                        disabled={values.disability !== "yes"}
                        name="kindofdisability"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                        onKeyPress={(event) => {
                          const keyCode = event.keyCode;
                          const keyValue = String.fromCharCode(keyCode);
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(keyValue)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/*  contack info */}
              <Grid container spacing={2} component={Paper} elevation={2} sx={{ borderRadius: "5px" }} p={3} mt={2}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#3b4056",
                      mb: 1,
                    }}
                  >
                    Contact Info
                  </Typography>
                  <hr style={{ marginBottom: "10px" }} />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="Mailing Address"
                    component={TextField}
                    name="mailingAddress"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    label="Mobile"
                    component={TextField}
                    name="mobile"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    placeholder="03XX-XXXXXXX"
                    onInput={(event) => {
                      const input = event.target.value;
                      const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedmob = formattedInput.replace(/(.{4})(.?)/, "$1-$2"); // Add dash after the fifth character
                      event.target.value = formattedmob;
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    label="Other Mobile"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    component={TextField}
                    name="otherMobile"
                    placeholder="03XX-XXXXXXX"
                    onInput={(event) => {
                      const input = event.target.value;
                      const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedmob = formattedInput.replace(/(.{4})(.?)/, "$1-$2"); // Add dash after the fifth character
                      event.target.value = formattedmob;
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    label="Who's Mobile is this?"
                    component={TextField}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    name="whosMobile"
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const regex = /^[a-zA-Z\s]+$/;
                      if (!regex.test(keyValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="Email"
                    component={TextField}
                    name="email"
                    type="email"
                  />
                </Grid>
              </Grid>

              {/* employee info */}
              <Grid container spacing={2} component={Paper} elevation={2} sx={{ borderRadius: "5px" }} mt={2} p={3}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#3b4056",
                      mb: 1,
                    }}
                  >
                    Employee Info
                  </Typography>
                  <hr style={{ marginBottom: "10px" }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {" "}
                  <Field
                    component={TextField}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="Employee Id"
                    name="empId"
                    className="w-full"
                    //disabled={role === "manager"}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    label="Designation"
                    name="designation"
                    className="w-full"
                    disabled={role === "manager"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="User Name"
                    name="userName"
                    className="w-full"
                    // disabled={role === "manager"}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    label="Password"
                    type="password"
                    name="password"
                    className="w-full"
                    disabled={role === "manager"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "5px",
                            },
                          }}
                        >
                          <InputLabel id="bankAccount-label">Bank Account</InputLabel>
                          <Field name="bankAccount" as={Select} labelId="bankAccount-label" label="BankAccount">
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Field>

                          <ErrorMessage name="bankAccount" style={{ color: "red" }} component="div" />
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Field
                        label="Account No"
                        component={TextField}
                        name="accountNo"
                        className="w-full"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                        disabled={values.bankAccount !== "yes"}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <div>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "5px",
                            },
                          }}
                        >
                          <InputLabel id="probation-label">Probation</InputLabel>
                          <Field name="probation" as={Select} labelId="probation-label" label="Probation">
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Field>
                          <ErrorMessage name="probation" style={{ color: "red" }} component="div" />
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Field
                        as="select"
                        name="probationMonths"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                        onChange={(e) => {
                          setFieldValue("probationMonths", e.target.value);
                          setFieldValue(
                            "endDate",
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() + parseInt(e.target.value),
                              new Date().getDate()
                            )
                              .toISOString()
                              .substring(0, 10)
                          );
                        }}
                        disabled={values.probation !== "yes"}
                        className="block text-gray-500 px-3 py-4 w-full rounded-md border border-gray-300 "
                      >
                        <option value="">Please Select Month</option>
                        <option value="1">1 Month</option>
                        <option value="2">2 Months</option>
                        <option value="3">3 Months</option>
                        <option value="4">4 Months</option>
                        <option value="5">5 Months</option>
                        <option value="6">6 Months</option>
                      </Field>
                      <ErrorMessage name="probationMonths" style={{ color: "red" }} component="div" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {role === "admin" &&
                    (values.probation === "yes" ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="startDate"
                            type="date"
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                            component={TextField}
                            label="Start Date"
                            InputLabelProps={{
                              shrink: true, // Ensure label shrinks to fit above input
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            label="End Date"
                            component={TextField}
                            name="endDate"
                            type="date"
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            label="Basic Pay in Probation Period"
                            type="number"
                            name="BasicPayInProbationPeriod"
                            className="w-full"
                            us
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            label="Allowances In Probation Period"
                            type="number"
                            name="AllowancesInProbationPeriod"
                            className="w-full"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            label="Basic Pay"
                            type="number"
                            name="BasicPayAfterProbationPeriod"
                            className="w-full"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            label="Allowances"
                            type="number"
                            name="AllowancesAfterProbationPeriod"
                            className="w-full"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      values.probation === "no" && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              component={TextField}
                              label="Basic Pay"
                              type="number"
                              name="BasicPayAfterProbationPeriod"
                              className="w-full"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "5px",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              component={TextField}
                              label="Allowances"
                              type="number"
                              name="AllowancesAfterProbationPeriod"
                              className="w-full"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "5px",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      )
                    ))}
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as="select"
                    name="role"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    className="block text-gray-500 px-3 py-4 w-full rounded-md border border-gray-300 "
                    disabled={role === "manager"}
                  >
                    <option value="" disabled>
                      Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </Field>
                  <ErrorMessage name="maritalStatus" style={{ color: "red" }} component="div" />
                </Grid>
              </Grid>
              {/* question  */}
              <Grid container spacing={2} component={Paper} mt={2} elevation={2} sx={{ borderRadius: "5px" }} p={3}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#3b4056",
                      mb: 1,
                    }}
                  >
                    Onboarding Questionnaire
                  </Typography>
                  <hr style={{ marginBottom: "10px" }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {" "}
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="policyBook-label">Policy Book Signed</InputLabel>
                      <Field name="policyBook" as={Select} labelId="policyBook-label" label="Policy Book Signed">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="policyBook" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="appointment-label">Appointment Letter Given</InputLabel>
                      <Field
                        name="appointment"
                        as={Select}
                        labelId="appointment-label"
                        label="Appointment Letter Given"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="appointment" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="annualLeave-label">Annual Leaves Signed</InputLabel>
                      <Field name="annualLeave" as={Select} labelId="annualLeave-label" label="Annual Leaves Signed">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="annualLeave" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="rules-label">Rules and Regulation Signed</InputLabel>
                      <Field name="rules" as={Select} labelId="rules-label" label="Rules and Regulation Signed">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="rules" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="attendence-label">Attendance Biometric</InputLabel>
                      <Field name="attendence" as={Select} labelId="attendence-label" label="Attendance Biometric">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="attendence" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="localServerAccount-label">Local Server Account Created</InputLabel>
                      <Field
                        name="localServerAccount"
                        as={Select}
                        labelId="localServerAccount-label"
                        label="Local Server Account Created"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="localServerAccount" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="slack-label">Added in Slack</InputLabel>
                      <Field name="slack" as={Select} labelId="slack-label" label="Added in Slack">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="slack" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="superAdmin-label">Super Admin</InputLabel>
                      <Field name="superAdmin" as={Select} labelId="superAdmin-label" label="Super Admin">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="superAdmin" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="whatsApp-label">Added in Whatsapp</InputLabel>
                      <Field name="whatsApp" as={Select} labelId="whatsApp-label" label="Added in Whatsapp">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="whatsApp" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <InputLabel id="empCard-label">Employee Card</InputLabel>
                      <Field name="empCard" as={Select} labelId="empCard-label" label="Employee Card">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Field>
                      <ErrorMessage name="empCard" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              {/* ===================================== Documents ======================================== */}

              <Grid container spacing={2} component={Paper} sx={{ borderRadius: "5px" }} mt={2} p={3}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      color: "#3b4056",
                      mb: 5,
                    }}
                  >
                    Upload Documents
                  </Typography>

                  <UploadFiles
                    values={values}
                    setFieldValue={setFieldValue}
                    tempFilesRef={tempFilesRef}
                    deletedFilesRef={deletedFilesRef}
                    parentFolder="Employee"
                    folderName={`${values.userName}_${values.empId}`}
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={toggleUploadModal} disabled={!values.userName && !values.empId}>
                Upload Document
              </Button>
              <Modal
                open={uploadModalOpen}
                onClose={closeUploadModal}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Test
                  values={values}
                  setFieldValue={setFieldValue}
                  folderName={`${user.employeeUsername}_${user.employeeID}`}
                  tempFilesRef={tempFilesRef}
                  deletedFilesRef={deletedFilesRef}
                  parentFolder="Employee"
                />
              </Modal>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="contained"
                  endIcon={
                    <PermIdentityIcon
                      sx={{
                        transition: "transform 0.3s", // Transition for icon
                      }}
                    />
                  }
                  onClick={() => {
                    //ScrollToErrorField is a custom utlity function
                    Object.keys(errors).length > 0 ? ScrollToErrorField(errors, setTouched) : handleSubmit();
                  }}
                >
                  UPDATE
                </Button>
              </div>
            </Form>
          </Grid>
          {loading && (
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
              <LoadingAnim />
            </Backdrop>
          )}
        </Box>
      )}
    </Formik>
  );
}
export default UpdateForm;
