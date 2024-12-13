import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { object, string } from "yup";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import { useQueryClient } from "@tanstack/react-query";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Card,
  Checkbox,
  ListItemText,
  Backdrop,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import "../../index.css";
import { Link } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/MessageContext";
import { useState } from "react";
import LoadingAnim from "../../components/LoadingAnim";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const validationSchema = object().shape({
  name: string()
    .required("Required Name")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only alphabetic characters and spaces are allowed"
    ),
  email: string().email().required("Required Email"),
  contact: string()
    .required("Required Field")
    .test("format", "contact must be in the format 03XX-XXXXXXX", (value) =>
      /^03\d{2}-\d{7}$/.test(value || "")
    ),
  CNIC: string()
    .required("Required CNIC")
    .test("format", "CNIC must be in the format XXXXX-XXXXXXX-X", (value) =>
      /^\d{5}-\d{7}-\d$/.test(value || "")
    ),
  qualification: string().required("Required Field"),
  workExp: string().required("Work Experience Required"),
});

const InterviewEvalForm = () => {
  const skills = [
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Zeplin",
    "Animation",
    "After Effects",
    "Blender",
    "React.js",
    "Angular",
    "Vue.js",
    "HTML",
    "CSS",
    "Sass/SCSS",
    "JavaScript",
    "TypeScript",
    "jQuery",
    "MERN Stack",
    "MEAN Stack",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Dart",
    "Objective-C",
    "Project Management",
    "Business Analyst",
    "Game Development",
    "Blockchain",
    "SEO",
    "WordPress",
    "Shopify",
  ];

  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [applyForselectedValue, setapplyForselectedValue] = useState("");
  const POST_EVALUATION = "/api/interview/add_evaluation";
  const queryClient = useQueryClient();


  const handleSuccess = () => {
    showMessage("success", "Evaluation Created successful!");
  };

  const handleError = () => {
    showMessage("error", "Evaluation Creation failed!");
  };

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        contact: "",
        CNIC: "",
        qualification: "",
        workExp: "",
        applyFor: "",
        internshipType: "",
        appliedOn: "",
        interviewCall: "",
        interviewTime: "",
        response: "",
        interviewRating: 0,
        testRating: 0,
        overallRating: 0,
        expectedSalary: "",
        expertiseAndSkills: [],
        file: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setLoading(true);
        var formData = new FormData();
        const fieldMap = {
          name: values.name,
          email: values.email,
          contact: values.contact,
          CNIC: values.CNIC,
          qualification: values.qualification,
          workExp: values.workExp,
          applyFor: values.applyFor,
          internshipType: values.internshipType,
          appliedOn: values.appliedOn,
          interviewCall: values.interviewCall,
          interviewTime: values.interviewTime,
          response: values.response,
          interviewRating: values.interviewRating,
          testRating: values.testRating,
          overallRating: values.overallRating,
          expectedSalary: values.expectedSalary,
          expertiseAndSkills: values.expertiseAndSkills,
          file: values.file,
        };
        for (const [fieldName, value] of Object.entries(fieldMap)) {
          formData.append(fieldName, value);
        }

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

        const jsonData = formDataToJson(formData);

        // Send POST request using axios
        await axios
          .post(POST_EVALUATION, jsonData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            setLoading(false);
            queryClient
              .invalidateQueries({
                queryKey: ["pending_evaluations"],
                exact: false,
              })
              .then(() => {
                console.log("Query invalidation completed successfully.");
              })
              .catch((error) => {
                console.error("Error invalidating queries:", error.message);
              });
            navigate("/interview-evaluation");
            handleSuccess();
          })
          .catch((error) => {
            setLoading(false);
            handleError();
            console.error(error);
          });
      }}
    >
      {({ values, setFieldValue }) => (
        <Box pt={2} sx={{height:"75vh"}}>
          <Link to={"/interview-evaluation"}>
            <Button startIcon={<KeyboardReturnIcon />}>Back</Button>
          </Link>
          <Card elevation={4} sx={{ p: 3, mt: 2 }}>
            <Form>
              <div className="grid md:grid-cols-3 w-full my-4  gap-5">
                <Field
                  label="Name"
                  component={TextField}
                  name="name"
                  onKeyPress={(event) => {
                    const keyCode = event.keyCode || event.which;
                    const keyValue = String.fromCharCode(keyCode);
                    const regex = /^[a-zA-Z\s]+$/;
                    if (!regex.test(keyValue)) {
                      event.preventDefault();
                    }
                  }}
                />

                <Field
                  label="contact"
                  component={TextField}
                  name="contact"
                  placeholder="03XX-XXXXXXX"
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

                <Field
                  label="Email"
                  component={TextField}
                  name="email"
                  type="email"
                />
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={4}>
                  {" "}
                  <Field
                    label="CNIC"
                    component={TextField}
                    fullWidth
                    name="CNIC"
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
                <Grid item xs={12} md={12} lg={4}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Skills
                    </InputLabel>
                    <Field name="expertiseAndSkills">
                      {({ field }) => (
                        <Select
                          {...field}
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          label="Skills"
                          value={values.expertiseAndSkills}
                          onChange={(event) =>
                            setFieldValue(
                              "expertiseAndSkills",
                              event.target.value
                            )
                          }
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          {skills.map((skill) => (
                            <MenuItem key={skill} value={skill}>
                              <Checkbox
                                checked={values.expertiseAndSkills.includes(
                                  skill
                                )}
                              />
                              <ListItemText primary={skill} />
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="gender-select">
                        {" "}
                        Qualification
                      </InputLabel>
                      <Field
                        fullWidth
                        label=" Qualification"
                        variant="outlined"
                        name="qualification"
                        as={Select}
                        onBlur={() => {}}
                      >
                        <MenuItem value="matriculation">Matriculation</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="graduation">Graduation</MenuItem>
                        <MenuItem value="masters">Masters</MenuItem>
                      </Field>
                    </FormControl>
                    <ErrorMessage
                      name="maritalStatus"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </Grid>
              </Grid>

              <div className="grid md:grid-cols w-full  my-4  gap-5">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={4}>
                    <Field
                      component={TextField}
                      InputLabelProps={{ shrink: true }}
                      label="Applied On"
                      name="appliedOn"
                      type="date"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Field
                      component={TextField}
                      InputLabelProps={{ shrink: true }}
                      label="Called for interview on"
                      name="interviewCall"
                      type="date"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={4}>
                    <Field
                      component={TextField}
                      InputLabelProps={{ shrink: true }}
                      label="Interview Time"
                      name="interviewTime"
                      type="time"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={4}>
                  <Typography sx={{ mb: "5px" }}>Upload CV</Typography>
                  <div className="w-full">
                    <input
                      type="file"
                      label="CV"
                      name="file"
                      onChange={(event) => {
                        setFieldValue("file", event.target.files[0]);
                      }}
                      className="border text-center py-2 px-2 w-full  border-dashed rounded border-gray-400"
                    />
                    <ErrorMessage
                      name="file"
                      style={{ color: "red" }}
                      component="div"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Typography sx={{ mb: "5px" }}>Work Experience</Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      row
                      aria-labelledby="my-radio-group"
                      name="workExp"
                      value={selectedValue}
                      onChange={(e) => setSelectedValue(e.target.value)}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              border:
                                selectedValue === "yes"
                                  ? "2px solid #005878"
                                  : "1px solid #ccc",
                              px: 1,
                              py: "5px",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { borderColor: "#005878" },
                            }}
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Field as={Radio} />}
                              label={
                                <Typography sx={{ fontSize: "0.9rem" }}>
                                  Experienced
                                </Typography>
                              }
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              border:
                                selectedValue === "no"
                                  ? "2px solid #005878"
                                  : "1px solid #ccc",
                              px: 1,
                              py: "5px",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { borderColor: "#005878" },
                            }}
                          >
                            <FormControlLabel
                              value="no"
                              control={<Field as={Radio} />}
                              label={
                                <Typography sx={{ fontSize: "0.9rem" }}>
                                  Inexperienced
                                </Typography>
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </RadioGroup>

                    <ErrorMessage
                      name="workExp"
                      component="div"
                      style={{ color: "red", marginTop: "5px" }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                  <Typography sx={{ mb: "5px" }}>Employement Type</Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      row
                      aria-labelledby="my-radio-group"
                      name="applyFor"
                      value={applyForselectedValue}
                      onChange={(e) => setapplyForselectedValue(e.target.value)}
                      sx={{ width: "100%" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              border:
                                applyForselectedValue === "permanent"
                                  ? "2px solid #005878"
                                  : "1px solid #ccc",
                              px: 1,
                              py: "5px",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { borderColor: "#005878" },
                            }}
                          >
                            {" "}
                            <FormControlLabel
                              value="permanent"
                              control={<Field as={Radio} />}
                              label={
                                <Typography sx={{ fontSize: "0.9rem" }}>
                                  Permanent
                                </Typography>
                              }
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              border:
                                applyForselectedValue === "internship"
                                  ? "2px solid #005878"
                                  : "1px solid #ccc",
                              px: 1,
                              py: "5px",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { borderColor: "#005878" },
                            }}
                          >
                            <FormControlLabel
                              value="internship"
                              control={<Field as={Radio} />}
                              label={
                                <Typography sx={{ fontSize: "0.9rem" }}>
                                  Internship
                                </Typography>
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </RadioGroup>
                    <ErrorMessage
                      name="applyFor"
                      component="div"
                      style={{ color: "red", marginTop: "5px" }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {values.applyFor === "internship" && (
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="gender-select">
                          Internship Type
                        </InputLabel>
                        <Field
                          fullWidth
                          label=" Internship Type"
                          variant="outlined"
                          name="internshipType"
                          as={Select}
                          onBlur={() => {}}
                        >
                          <MenuItem value="UNPAID">UNPAID</MenuItem>
                          <MenuItem value="VBT">VBT</MenuItem>
                          <MenuItem value="PASHA">P@SHA</MenuItem>
                          <MenuItem value="PSEB">PSEB</MenuItem>
                        </Field>
                      </FormControl>
                      <ErrorMessage
                        name="internshipType"
                        style={{ color: "red" }}
                        component="div"
                      />
                    </div>
                  )}
                </Grid>
              </Grid>
              <Button
                variant="contained"
                type="submit"
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
                  <DomainVerificationIcon
                    sx={{
                      transition: "transform 0.3s", // Transition for icon
                    }}
                  />
                }
              >
                Submit
              </Button>
            </Form>
          </Card>
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

export default InterviewEvalForm;
