import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Backdrop,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import LoadingAnim from "../../components/LoadingAnim";
import UploadFiles from "../../components/upload/UploadFiles";
import "../../index.css";
import axios from "../../utils/axiosInterceptor";
import { ScrollToErrorField } from "../../utils/common";
import { useWindowCloseHandler } from "../../hooks/useWindowCloseHandler";
import { QueryClient, useQueries, useQueryClient } from "@tanstack/react-query";

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

  disability: string()
    .required("Disability is required")
    .oneOf(["yes", "no"], "Disability must be either 'yes' or 'no'"),
  kindofdisability: string().when("disability", {
    is: "yes",
    then: (schema) => schema.required("Required Field"),
    otherwise: (schema) => schema.notRequired(),
  }),

  employeeProImage: object()
    .required("Required Field")
    .test(
      "is-not-empty", // Test name
      "The object must not be empty",
      (value) => value && Object.keys(value).length > 0
    ),
});

function CreateEmployeeForm() {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const userNameInputRef = useRef();

  const tempFilesRef = useRef([]);
  const deletedFilesRef = useRef([]);

  // Custom Hook to prevent WindowClose
  useWindowCloseHandler(tempFilesRef);

  return (
    <Formik
      initialValues={{
        firstName: "",
        fatherName: "",
        cnic: "",
        dob: "",
        mailingAddress: "",
        disability: "",
        kindofdisability: "",
        mobile: "",
        email: "",
        gender: "",
        maritalStatus: "",
        otherMobile: "",
        whosMobile: "",
        qualification: "",
        startDate: new Date().toISOString().substr(0, 10),
        dateconfirmed: new Date().toISOString().substr(0, 10),

        empId: "",
        designation: "",

        userName: "",
        password: "",
        role: "",

        probation: "",
        probationMonths: "",

        BasicPayInProbationPeriod: 0,
        BasicPayAfterProbationPeriod: 0,
        AllowancesInProbationPeriod: 0,
        AllowancesAfterProbationPeriod: 0,

        bankAccount: "",
        accountNo: "",

        // Onboarding Questionnaire
        policyBook: "",
        appointment: "",
        annualLeave: "",
        attendence: "",
        localServerAccount: "",
        rules: "",
        slack: "",
        superAdmin: "",
        whatsApp: "",
        empCard: "",

        // Documents
        employeeProImage: {},
        policeCertificateUpload: [],
        cnicScanCopy: [],
        degreesScanCopy: [],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setLoading(false);
        const fieldMap = {
          employeeName: values.firstName,
          employeeFatherName: values.fatherName,
          employeeCNIC: values.cnic,
          dateOfBirth: values.dob.split("T")[0],
          mailingAddress: values.mailingAddress,
          mobileNumber: values.mobile,
          guardiansMobileNumber: values.otherMobile,
          email: values.email,
          maritalStatus: values.maritalStatus,
          gender: values.gender,
          disability: values.disability,
          disabilityType: values.kindofdisability,
          qualification: values.qualification,
          dateOfJoining: values.startDate.split("T")[0],
          dateConfirmed: values.dateconfirmed.split("T")[0],
          probationPeriod: values.probation,
          probationMonth: values.probationMonths,
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
          BasicPayInProbationPeriod: values.BasicPayInProbationPeriod || 0,
          BasicPayAfterProbationPeriod: values.BasicPayAfterProbationPeriod || 0,
          AllowancesInProbationPeriod: values.AllowancesInProbationPeriod || 0,
          AllowancesAfterProbationPeriod: values.AllowancesAfterProbationPeriod || 0,
          employeeUsername: values.userName,
          employeePassword: values.password,

          superAdmin: values.superAdmin,
          whosMobile: values.whosMobile,

          //Documents
          employeeProImage: values.employeeProImage,
          cnicScanCopy: values.cnicScanCopy,
          policeCertificateUpload: values.policeCertificateUpload,
          degreesScanCopy: values.degreesScanCopy,
        };

        await axios
          .post(
            "/api/employee/create_employee",
            {
              updateData: fieldMap,
              deletedFiles: deletedFilesRef.current,
            },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            setLoading(false);
            toast.success("Employee Added Successfully!");

            queryClient.invalidateQueries("employees");
            navigate("/manage-employees");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error("error", "Employee Creation failed!");
          });
      }}
    >
      {({ values, setFieldValue, handleSubmit, errors, setTouched }) => {
        return (
          <Box m={5}>
            <Form className="ml-5">
              <Grid container spacing={2} component={Paper} sx={{ borderRadius: "5px" }} p={3}>
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
                  <FastField
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
                  <FastField
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
                  <FastField
                    label="CNIC"
                    component={TextField}
                    name="cnic"
                    placeholder="XXXXX-XXXXXXX-X"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
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
                  <FastField
                    label="Date Of Birth"
                    InputLabelProps={{ shrink: true }}
                    component={TextField}
                    type="date"
                    name="dob"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
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
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <FastField name="gender" as={Select} labelId="gender-label" label="Gender">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </FastField>
                      <ErrorMessage name="gender" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
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
                      <InputLabel id="maritalStatus-label">Marital Status</InputLabel>
                      <FastField name="maritalStatus" as={Select} labelId="maritalStatus-label" label="Marital Status">
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                        <MenuItem value="divorced">Divorced</MenuItem>
                        <MenuItem value="widowed">Widowed</MenuItem>
                      </FastField>
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
                      <FastField name="qualification" as={Select} labelId="qualification-label" label="Qualification">
                        <MenuItem value="matriculation">Matriculation</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="graduation">Bachelors</MenuItem>
                        <MenuItem value="masters">Masters</MenuItem>
                      </FastField>
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
                          <FastField
                            name="disability"
                            as={Select}
                            labelId="disability-label"
                            label="Disability"
                            // onChange={(event) => {
                            //   setFieldValue("disability", event.target.value);
                            // }}

                            onChange={(event) => {
                              const { value } = event.target;
                              setFieldValue("disability", value);
                              if (value === "no") {
                                setFieldValue("kindofdisability", "");
                              }
                            }}
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </FastField>
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
                          const regex = /^[a-zA-Z\s]+$/;
                          if (!regex.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={2} component={Paper} sx={{ borderRadius: "5px" }} mt={2} p={3}>
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
                  <FastField
                    label="Mailing Address"
                    component={TextField}
                    name="mailingAddress"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FastField
                    label="Mobile Number"
                    component={TextField}
                    name="mobile"
                    placeholder="03XX-XXXXXXX"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    onInput={(event) => {
                      const input = event.target.value;
                      const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedmob = formattedInput.replace(/(.{4})(.?)/, "$1-$2"); // Add dash after the fifth character
                      event.target.value = formattedmob;
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FastField
                    label="Other Mobile Number"
                    component={TextField}
                    name="otherMobile"
                    placeholder="03XX-XXXXXXX"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    Number
                    onInput={(event) => {
                      const input = event.target.value;
                      const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedmob = formattedInput.replace(/(.{4})(.?)/, "$1-$2"); // Add dash after the fifth character
                      event.target.value = formattedmob;
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FastField
                    label="Who's Mobile is this?"
                    component={TextField}
                    name="whosMobile"
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
                  <FastField
                    label="Email"
                    component={TextField}
                    name="email"
                    type="email"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} component={Paper} sx={{ borderRadius: "5px" }} mt={2} p={3}>
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
                  <FastField
                    component={TextField}
                    label="Employee Id"
                    name="empId"
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
                  <FastField
                    component={TextField}
                    label="Designation"
                    name="designation"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    className="w-full"
                    disabled={role === "manager"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FastField
                    component={TextField}
                    label="User Name"
                    name="userName"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    className="w-full"
                    disabled={role === "manager"}
                    inputRef={userNameInputRef}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    label="Password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full"
                    disabled={role === "manager"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                        name="accountNo"
                        className="w-full"
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
                        className="block text-gray-600 px-3 py-4 w-full rounded-md border border-gray-600 "
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
                          <FastField
                            label="Start Date"
                            component={TextField}
                            name="startDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FastField
                            label="End Date"
                            component={TextField}
                            name="endDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FastField
                            component={TextField}
                            label="Basic Pay in Probation Period"
                            type="number"
                            name="BasicPayInProbationPeriod"
                            className="w-full"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "5px",
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FastField
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
                          <FastField
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
                          <FastField
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
                            <FastField
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
                            <FastField
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
                  <FastField
                    as="select"
                    name="role"
                    className="block text-gray-600 px-3 py-4 w-full rounded-md border border-gray-600 "
                    disabled={role === "manager"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  >
                    <option value="" disabled>
                      Role
                    </option>
                    {/* <option value="admin">Admin</option> */}
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </FastField>
                  <ErrorMessage name="maritalStatus" style={{ color: "red" }} component="div" />
                </Grid>
              </Grid>

              <Grid container spacing={2} component={Paper} sx={{ borderRadius: "5px" }} mt={2} p={3}>
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
                      <FastField name="policyBook" as={Select} labelId="policyBook-label" label="Policy Book Signed">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField
                        name="appointment"
                        as={Select}
                        labelId="appointment-label"
                        label="Appointment Letter Given"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField
                        name="annualLeave"
                        as={Select}
                        labelId="annualLeave-label"
                        label="Annual Leaves Signed"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="rules" as={Select} labelId="rules-label" label="Rules and Regulation Signed">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="attendence" as={Select} labelId="attendence-label" label="Attendance Biometric">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField
                        name="localServerAccount"
                        as={Select}
                        labelId="localServerAccount-label"
                        label="Local Server Account Created"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="slack" as={Select} labelId="slack-label" label="Added in Slack">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="superAdmin" as={Select} labelId="superAdmin-label" label="Super Admin">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="whatsApp" as={Select} labelId="whatsApp-label" label="Added in Whatsapp">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
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
                      <FastField name="empCard" as={Select} labelId="empCard-label" label="Employee Card">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </FastField>
                      <ErrorMessage name="empCard" style={{ color: "red" }} component="div" />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              {/* ============================================  Documents   ============================================== */}

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

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="contained"
                  sx={{ marginTop: "20px" }}
                  endIcon={
                    <PersonAddAltIcon
                      sx={{
                        transition: "transform 0.3s", // Transition for icon
                      }}
                    />
                  }
                  //ScrollToErrorField is a custom utlity function
                  // onClick={() => {
                  //   Object.keys(errors).length > 0 ? ScrollToErrorField(errors, setTouched) : handleSubmit();
                  // }}

                  onClick={() => {
                    if (Object.keys(errors).length > 0) {
                      if (errors.employeeProImage) {
                        alert("Employee Image is required.");
                      }
                      ScrollToErrorField(errors, setTouched);
                    } else {
                      handleSubmit();
                    }
                  }}
                >
                  Create
                </Button>
              </div>
            </Form>
            {loading && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <LoadingAnim />
              </Backdrop>
            )}
          </Box>
        );
      }}
    </Formik>
  );
}
export default CreateEmployeeForm;
