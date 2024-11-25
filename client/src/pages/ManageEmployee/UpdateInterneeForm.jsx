import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useEffect, useState } from "react";
import { object, string } from "yup";
// import "../../index.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  Backdrop,
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";
import axios from "../../utils/axiosInterceptor";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMessage } from "../../components/MessageContext";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LoadingAnim from "../../components/LoadingAnim";

const validationSchema = object().shape({
  firstName: string()
    .required("Required Name")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only alphabetic characters and spaces are allowed"
    ),
  fatherName: string()
    .required("Required Name")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters are allowed"),
  cnic: string()
    .required("Required CNIC")
    .test("format", "CNIC must be in the format XXXXX-XXXXXXX-X", (value) =>
      /^\d{5}-\d{7}-\d$/.test(value || "")
    ),
  dob: string().required("Enter Date"),
  mailingAddress: string().required("Enter Mailing Address"),
  mobile: string()
    .required("Required Field")
    .test("format", "Mobile must be in the format 03XX-XXXXXXX", (value) =>
      /^03\d{2}-\d{7}$/.test(value || "")
    ),
  email: string().email().required("Required Email"),
  gender: string().required("Required Field"),
  maritalStatus: string().required("Required Field"),
  otherMobile: string()
    .required("Required Field")
    .test("format", "Mobile must be in the format 03XX-XXXXXXX", (value) =>
      /^03\d{2}-\d{7}$/.test(value || "")
    ),
  whosMobile: string()
    .required("Required Name")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only alphabetic characters and spaces are allowed"
    ),
  qualification: string().required("Required Field"),
  rules: string().required("Required Field"),
  slack: string().required("Required Field"),
  internshipFrom: string().required("Required Field"),
  internshipTo: string().required("Required Field"),
  internId: string().required("Required Field"),
  designation: string().required("Required Field"),
  offered_By: string().required("Required Field"),
});

const UpdateInterneeForm = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const truncateFileName = (fileName, maxLength = 15) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;
    return `${fileName.slice(0, maxLength)}...`;
  };

  const handleSuccess = () => {
    showMessage("success", "Internee Data Updated successful!");
  };

  const handleError = () => {
    showMessage("error", "Internee Data Update failed!");
  };

  // const id = "660143ae9e0a854393b23f90";
  useEffect(() => {
    // const id = '65fbacabf77395d5bfa3a168';
    axios
      .get(`/api/internee/get_internee/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
        // console.log(response.data); // Logging the response data
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <Formik
      initialValues={{
        firstName: user.firstName || "",
        fatherName: user.fatherName || "",
        cnic: user.cnic || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        mailingAddress: user.mailingAddress || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        email: user.email || "",
        maritalStatus: user.maritalStatus || "",
        otherMobile: user.otherMobile || "",
        whosMobile: user.whosMobile || "",
        qualification: user.qualification || "",
        appointmentFile: user.appointmentFile || "",
        rules: user.rules || "",
        slack: user.slack || "",
        cnicFile: user.cnicFile || "",
        internshipFrom: user.internshipFrom
          ? user.internshipFrom.split("T")[0]
          : "",
        internshipTo: user.internshipTo ? user.internshipTo.split("T")[0] : "",
        internId: user.internId || "",
        designation: user.designation || "",
        experienceLetter: user.experienceLetter || "",
        givenOn: user.givenOn ? user.givenOn.split("T")[0] : "",
        offered_By: user.offered_By || "",
        interneeProImage: user.interneeProImage || "",
        disability: user.disability || "no",
        kindofdisability: user.disabilityType || "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setLoading(true);
        var formData = new FormData();
        const fieldMap = {
          firstName: values.firstName,
          fatherName: values.fatherName,
          cnic: values.cnic,
          dob: values.dob,
          mailingAddress: values.mailingAddress,
          mobile: values.mobile,
          email: values.email,
          gender: values.gender,
          maritalStatus: values.maritalStatus,
          otherMobile: values.otherMobile,
          whosMobile: values.whosMobile,
          qualification: values.qualification,
          rules: values.rules,
          slack: values.slack,
          internshipFrom: values.internshipFrom,
          internshipTo: values.internshipTo,
          internId: values.internId,
          designation: values.designation,
          offered_By: values.offered_By,
          appointmentFile: values.appointmentFile,
          cnicFile: values.cnicFile,
          experienceLetter: values.experienceLetter,
          givenOn: values.givenOn,
          interneeProImage: values.interneeProImage,
          disability: values.disability,
          disabilityType: values.kindofdisability,
        };

        for (const [fieldName, value] of Object.entries(fieldMap)) {
          formData.append(fieldName, value);
        }
        const jsonData = formDataToJson(formData);
        function formDataToJson(formData) {
          const json = {};
          formData.forEach((value, key) => {
            // Check if the key already exists in the JSON object
            if (json.hasOwnProperty(key)) {
              // If the key already exists, convert the value to an array
              if (!Array.isArray(json[key])) {
                json[key] = [json[key]];
              }
              // Push the new value to the array
              json[key].push(value);
            } else {
              // If the key doesn't exist, set the value directly
              json[key] = value;
            }
          });
          return json;
        }

        const response = await axios
          .patch(`/api/internee/update_internee/${id}`, jsonData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((data) => {
            setLoading(false);
            navigate("/manage-employees");
            handleSuccess();
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            handleError();
          });
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Box m={5}>
          <Form>
            <Grid
              container
              spacing={2}
              component={Paper}
              elevation={2}
              borderRadius={"5px"}
              p={3}
            >
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
                <Field
                  label="Date Of Birth"
                  InputLabelProps={{ shrink: true }}
                  component={TextField}
                  name="dob"
                  fullWidth
                  type="date"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as="select"
                  name="gender"
                  id="gender"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                  className="block text-gray-500 px-3 py-4 w-full rounded-md border border-gray-300 "
                >
                  <option value="" disabled>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  style={{ color: "red" }}
                  component="div"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <div>
                  <Field
                    fullWidth
                    as="select"
                    name="maritalStatus"
                    className="block text-gray-500 px-3 py-4 w-full rounded-md border border-gray-300 "
                  >
                    <option value="" disabled>
                      Marital Status
                    </option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Field>
                  <ErrorMessage
                    name="maritalStatus"
                    style={{ color: "red" }}
                    component="div"
                  />
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
                    <InputLabel id="qualification-label">
                      Qualification
                    </InputLabel>
                    <Field
                      name="qualification"
                      as={Select}
                      labelId="qualification-label"
                      label="Qualification"
                    >
                      <MenuItem value="matriculation">Matriculation</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="bachelors">Bachelors</MenuItem>
                      <MenuItem value="masters">Masters</MenuItem>
                    </Field>
                    <ErrorMessage
                      name="qualification"
                      style={{ color: "red" }}
                      component="div"
                    />
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
                        <InputLabel id="disability-label">
                          Disability
                        </InputLabel>
                        <Field
                          name="disability"
                          as={Select}
                          labelId="disability-label"
                          label="Disability"
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="disability"
                          style={{ color: "red" }}
                          component="div"
                        />
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

            <Grid
              container
              spacing={2}
              component={Paper}
              elevation={2}
              borderRadius={"5px"}
              mt={2}
              p={3}
            >
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
                <Field
                  label="Mobile"
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
                    const formattedmob = formattedInput.replace(
                      /(.{4})(.?)/,
                      "$1-$2"
                    ); // Add dash after the fifth character
                    event.target.value = formattedmob;
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Other Mobile"
                  component={TextField}
                  name="otherMobile"
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
                    const formattedmob = formattedInput.replace(
                      /(.{4})(.?)/,
                      "$1-$2"
                    ); // Add dash after the fifth character
                    event.target.value = formattedmob;
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
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
                <Field
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

            <Grid
              container
              spacing={2}
              component={Paper}
              elevation={2}
              borderRadius={"5px"}
              mt={2}
              p={3}
            >
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

              <Grid item xs={12} sm={6}>
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
                    <InputLabel id="my-radio-groupl">
                      Rules and Regulation Signed
                    </InputLabel>
                    <Field
                      name="rules"
                      as={Select}
                      labelId="my-radio-group"
                      label="Rules and Regulation Signed"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Field>
                    <ErrorMessage
                      name="rules"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
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
                    <InputLabel id="my-radio-groupl">Added in Slack</InputLabel>
                    <Field
                      name="slack"
                      as={Select}
                      labelId="my-radio-group"
                      label="Added in Slack"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Field>
                    <ErrorMessage
                      name="slack"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </FormControl>
                </div>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              component={Paper}
              elevation={2}
              borderRadius={"5px"}
              mt={2}
              p={3}
            >
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#3b4056",
                    mb: 1,
                  }}
                >
                  Internee Info
                </Typography>
                <hr style={{ marginBottom: "10px" }} />
              </Grid>
              <Grid item xs={12}>
                <div className="my-4">
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
                      <InputLabel htmlFor="gender-select">
                        Internship Type:
                      </InputLabel>
                      <Field
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                        label="Internship Type:"
                        variant="outlined"
                        name="offered_By"
                        as={Select}
                        onBlur={() => {}}
                        onChange={(e) => {
                          const selectedCompany = e.target.value;
                          let monthsToAdd = 0;
                          if (
                            selectedCompany === "Pasha" ||
                            selectedCompany === "PSEB"
                          ) {
                            monthsToAdd = 6;
                          } else if (selectedCompany === "VBT") {
                            monthsToAdd = 3;
                          }

                          const toDate = new Date();
                          toDate.setMonth(toDate.getMonth() + monthsToAdd);
                          const formattedDate = toDate
                            .toISOString()
                            .substring(0, 10);

                          setFieldValue("offered_By", selectedCompany); // Corrected field name
                          setFieldValue("internshipTo", formattedDate);
                        }}
                      >
                        <MenuItem value="VBT">
                          Unpaid 3 Months from VBT
                        </MenuItem>
                        <MenuItem value="Pasha">
                          Paid 6 Months from PSEB
                        </MenuItem>
                        <MenuItem value="PSEB">
                          Paid 6 Months from P@SHA
                        </MenuItem>
                      </Field>
                    </FormControl>

                    <ErrorMessage
                      name="offered_By"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </div>

                {(user.offered_By === "VBT" ||
                  user.offered_By === "Pasha" ||
                  user.offered_By === "PSEB") && (
                  <>
                    <div className="grid grid-col-2">
                      <label className="text-left font-semibold">
                        Internship
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-5  my-4">
                      <Field
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        component={TextField}
                        name="internshipFrom"
                        type="date"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                      />
                      <Field
                        label="To"
                        InputLabelProps={{ shrink: true }}
                        component={TextField}
                        name="internshipTo"
                        type="date"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                          },
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-5 my-4">
                  <Field
                    label="Internee Id"
                    component={TextField}
                    name="internId"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                      },
                    }}
                  />
                  <Field
                    label="Designation"
                    component={TextField}
                    name="designation"
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
                </div>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              component={Paper}
              elevation={2}
              borderRadius={"5px"}
              mt={2}
              p={3}
            >
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#3b4056",
                    mb: 1,
                  }}
                >
                  Documents
                </Typography>
                <hr style={{ marginBottom: "10px" }} />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <label className="block font-semibold  mb-2">CNIC</label>
                  <div className="flex items-center justify-start border border-dashed border-gray-400 rounded py-2 px-10  bg-gray-50 hover:bg-gray-100 transition duration-150">
                    <input
                      type="file"
                      name="cnicFile"
                      onChange={(event) => {
                        setFieldValue("cnicFile", event.target.files[0]);
                      }}
                      className="hidden"
                      id="cnicFile"
                    />
                    <label
                      htmlFor="cnicFile"
                      className="text-center cursor-pointer py-2 px-4 bg-[#00AFEF] text-white rounded hover:bg-[#008CBF] transition duration-150"
                    >
                      <UploadIcon /> Choose File
                    </label>
                    {user.cnicFile ? (
                      <div className="ml-2 text-gray-700 whitespace-normal break-words max-w-xs">
                        Selected file:{" "}
                        {values.cnicFile.name ||
                          truncateFileName(user.cnicFile)}
                      </div>
                    ) : (
                      <span className="ml-2 text-gray-700">No File Chosen</span>
                    )}{" "}
                    <ErrorMessage
                      name="cnicFile"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <label className="block font-semibold  mb-2">
                    Experience Letter
                  </label>
                  <div className="flex items-center justify-start border border-dashed border-gray-400 rounded py-2 px-10  bg-gray-50 hover:bg-gray-100 transition duration-150">
                    <input
                      type="file"
                      name="experienceLetter"
                      onChange={(event) => {
                        setFieldValue(
                          "experienceLetter",
                          event.target.files[0]
                        );
                      }}
                      className="hidden"
                      id="experienceLetter"
                    />
                    <label
                      htmlFor="experienceLetter"
                      className="text-center cursor-pointer py-2 px-4 bg-[#00AFEF] text-white rounded hover:bg-[#008CBF] transition duration-150"
                    >
                      <UploadIcon /> Choose File
                    </label>
                    {user.experienceLetter ? (
                      <div className="ml-2 text-gray-700 whitespace-normal break-words max-w-xs">
                        Selected file:{" "}
                        {values.experienceLetter.name ||
                          truncateFileName(user.experienceLetter)}
                      </div>
                    ) : (
                      <span className="ml-2 text-gray-700">No File Chosen</span>
                    )}{" "}
                    <ErrorMessage
                      name="experienceLetter"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <div>
                    <label className="block font-semibold">profile pic</label>
                    <div className="flex items-center justify-start border border-dashed border-gray-400 rounded py-2 px-10  bg-gray-50 hover:bg-gray-100 transition duration-150">
                      <input
                        type="file"
                        name="interneeProImage"
                        onChange={(event) => {
                          setFieldValue(
                            "interneeProImage",
                            event.target.files[0]
                          );
                        }}
                        className="hidden"
                        id="interneeProImage"
                      />
                      <label
                        htmlFor="interneeProImage"
                        className="text-center cursor-pointer py-2 px-4 bg-[#00AFEF] text-white rounded hover:bg-[#008CBF] transition duration-150"
                      >
                        <UploadIcon /> Choose File
                      </label>
                      {user.interneeProImage ? (
                        <div className="ml-2 text-gray-700 whitespace-normal break-words max-w-xs">
                          Selected file:{" "}
                          {values.interneeProImage.name ||
                            truncateFileName(user.interneeProImage)}
                        </div>
                      ) : (
                        <span className="ml-2 text-gray-700 break-words max-w-xs">
                          No File Chosen
                        </span>
                      )}{" "}
                      <ErrorMessage
                        name="interneeProImage"
                        style={{ color: "red" }}
                        component="div"
                      />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <label className="block font-semibold ">
                    Appoitment Letter
                  </label>
                  <div className="flex items-center justify-start border border-dashed border-gray-400 rounded py-2 px-10  bg-gray-50 hover:bg-gray-100 transition duration-150">
                    <input
                      type="file"
                      name="appointmentFile"
                      onChange={(event) => {
                        setFieldValue("appointmentFile", event.target.files[0]);
                      }}
                      className="hidden"
                      id="appointmentFile"
                    />
                    <label
                      htmlFor="appointmentFile"
                      className="text-center cursor-pointer py-2 px-4 bg-[#00AFEF] text-white rounded hover:bg-[#008CBF] transition duration-150"
                    >
                      <UploadIcon /> Choose File
                    </label>
                    {user.appointmentFile ? (
                      <div className="ml-2 text-gray-700 whitespace-normal break-words max-w-xs">
                        Selected file:{" "}
                        {values.appointmentFile.name ||
                          truncateFileName(user.appointmentFile)}
                      </div>
                    ) : (
                      <span className="ml-2 text-gray-700">No File Chosen</span>
                    )}{" "}
                    <ErrorMessage
                      name="appointmentFile"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Field
                  label="Given On"
                  InputLabelProps={{ shrink: true }}
                  component={TextField}
                  name="givenOn"
                  type="date"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <div className="flex justify-end w-full mt-4">
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  mt: 4,
                  borderRadius: "5px",
                  px: 7,
                  backgroundColor: "#0081b1", // Primary color
                  color: "#fff", // Text color
                  transition: "background-color 0.3s, transform 0.3s", // Transition for background and transform
                  "&:hover": {
                    backgroundColor: "#00afef", // Darker shade on hover
                    transform: "scale(1.03)", // Scale effect on hover
                    "& .MuiSvgIcon-root": {
                      // Target the icon inside the button
                      transform: "scale(1.3)",
                      color: "#fff",
                    },
                  },
                  "&:disabled": {
                    backgroundColor: "#bdbdbd", // Disabled color
                    color: "#fff",
                  },
                }}
                endIcon={
                  <PersonAddAltIcon
                    sx={{
                      transition: "transform 0.3s", // Transition for icon
                    }}
                  />
                }
              >
                Update
              </Button>
            </div>
          </Form>
          {loading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <LoadingAnim />
            </Backdrop>
          )}
        </Box>
      )}
    </Formik>
  );
};

export default UpdateInterneeForm;
