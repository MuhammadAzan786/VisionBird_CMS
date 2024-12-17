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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoadingAnim from "../../components/LoadingAnim";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { TextField } from "formik-material-ui";

import dayjs from "dayjs";
import toast from "react-hot-toast";
import { ScrollToErrorField } from "../../utils/common";
import UploadFilesInternee from "../../components/upload/UploadFilesInternee";

import axios from "../../utils/axiosInterceptor";
import { useQueryClient } from "@tanstack/react-query";
import { useWindowCloseHandler } from "../../hooks/useWindowCloseHandler";

// import axios from "axios";

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
  disability: string()
    .required("Disability is required")
    .oneOf(["yes", "no"], "Disability must be either 'yes' or 'no'"),
  kindofdisability: string().when("disability", {
    is: "yes",
    then: (schema) => schema.required("Required Field"),
    otherwise: (schema) => schema.notRequired(),
  }),

  interneeProImage: object()
    .required("Required Field")
    .test(
      "is-not-empty", // Test name
      "The object must not be empty",
      (value) => value && Object.keys(value).length > 0
    ),
});

const UpdateInterneeForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const tempFilesRef = useRef([]);
  const deletedFilesRef = useRef([]);
  const nameRef = useRef("");

  // Custom Hook to prevent WindowClose
  useWindowCloseHandler(tempFilesRef);

  useEffect(() => {
    axios
      .get(`/api/internee/get_internee/${id}`)
      .then((response) => {
        setUser(response.data);
        nameRef.current = response.data.firstName;
        console.log("current value", nameRef.current);
        console.log(response.data);
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
        internshipFrom: dayjs().format(
          user.internshipFrom ? user.internshipFrom.split("T")[0] : ""
        ),
        internshipTo: user.internshipTo ? user.internshipTo.split("T")[0] : "",
        internId: user.internId || "",
        designation: user.designation || "",
        experienceLetter: user.experienceLetter || "",
        offered_By: user.offered_By || "",
        interneeProImage: user.interneeProImage || "",
        disability: user.disability || "no",
        kindofdisability: user.disabilityType || "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        // setLoading(true);

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

          interneeProImage: values.interneeProImage,
          disability: values.disability,
          disabilityType: values.kindofdisability,
        };

        console.log("Internee Form Data", fieldMap);
        console.log("Deleted Files List", deletedFilesRef.current);

        await axios
          .patch(`/api/internee/update_internee/${id}`, {
            updateData: fieldMap,
            deletedFiles: deletedFilesRef.current,
          })
          .then(() => {
            setLoading(false);
            toast.success("Internee Updated Successfully!");
            navigate("/manage-internees");
            queryClient.invalidateQueries("internees");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error("Internee Creation failed!");
          });
      }}
    >
      {({ values, setFieldValue, errors, setTouched, handleSubmit }) => (
        <Box m={5}>
          <Form>
            <Grid
              container
              spacing={2}
              component={Paper}
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
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date Of Birth"
                      format="DD/MM/YYYY"
                      name="dob"
                      value={dayjs(values.dob) || dayjs()}
                      onChange={(newValue) => {
                        const fromDate = dayjs(newValue);
                        setFieldValue("dob", fromDate.format("YYYY-MM-DD"));
                      }}
                      slotProps={{
                        textField: {
                          helperText: "DD/MM/YYYY",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
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
                          on
                          label="Disability"
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
                          const fromDate = new Date();

                          setFieldValue("offered_By", selectedCompany); // Corrected field name
                          setFieldValue("internshipTo", formattedDate);
                          setFieldValue("internshipFrom", fromDate);
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {/* From Date Picker */}
                        <DatePicker
                          label="From"
                          format="DD/MM/YYYY"
                          name="internshipFrom"
                          value={dayjs(values.internshipFrom)}
                          onChange={(newValue) => {
                            const fromDate = dayjs(newValue);
                            setFieldValue(
                              "internshipFrom",
                              fromDate.format("YYYY-MM-DD")
                            );

                            // Calculate new "To" date
                            const selectedCompany = values.offered_By;
                            let monthsToAdd = 0;

                            if (
                              selectedCompany === "Pasha" ||
                              selectedCompany === "PSEB"
                            ) {
                              monthsToAdd = 6;
                            } else if (selectedCompany === "VBT") {
                              monthsToAdd = 3;
                            }

                            const toDate = fromDate.add(monthsToAdd, "month");
                            setFieldValue(
                              "internshipTo",
                              toDate.format("YYYY-MM-DD")
                            );
                          }}
                          slotProps={{
                            textField: {
                              helperText: "DD/MM/YYYY",
                            },
                          }}
                        />

                        {/* To Date Picker */}
                        <DatePicker
                          label="To"
                          name="internshipTo"
                          format="DD/MM/YYYY"
                          value={dayjs(values.internshipTo)}
                          //  readOnly // To ensure "To" date is not manually editable
                          slotProps={{
                            textField: {
                              helperText: "DD/MM/YYYY",
                            },
                          }}
                        />
                      </LocalizationProvider>
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

            {/* ============================================  Documents   ============================================== */}

            <Grid
              container
              spacing={2}
              component={Paper}
              sx={{ borderRadius: "5px" }}
              mt={2}
              p={3}
            >
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#3b4056",
                    mb: 5,
                  }}
                >
                  Documents
                </Typography>

                <UploadFilesInternee
                  values={values}
                  setFieldValue={setFieldValue}
                  tempFilesRef={tempFilesRef}
                  deletedFilesRef={deletedFilesRef}
                  parentFolder="Internee"
                  folderName={`${nameRef.current.replace(/\s+/g, "").trim()}_${
                    values.internId
                  }`}
                />
              </Grid>
            </Grid>

            <div className="flex justify-end w-full mt-4">
              <Button
                type="button"
                variant="contained"
                endIcon={
                  <PersonAddAltIcon
                    sx={{
                      transition: "transform 0.3s",
                    }}
                  />
                }
                //ScrollToErrorField is a custom utlity function
                onClick={() => {
                  if (Object.keys(errors).length > 0) {
                    if (errors.interneeProImage) {
                      alert("Internee Image is required.");
                    }
                    ScrollToErrorField(errors, setTouched);
                  } else {
                    handleSubmit();
                  }
                }}
              >
                Update Internee
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
