import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { object, string } from "yup";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
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
  const POST_EVALUATION = "/api/interview/add_evaluation";
  // console.log(value);

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
        console.log(values);
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
        <Box p={3}>
          <Link to={"/interview-evaluation"}>
            <Button startIcon={<KeyboardReturnIcon />}>
              Back to Evaluation Page
            </Button>
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

              <div className="grid grid-cols-1 w-full  gap-5">
                <Field
                  label="CNIC"
                  component={TextField}
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
              </div>

              <div className="grid md:grid-cols-3 w-full  my-4  gap-5">
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

                <div role="group" aria-labelledby="my-radio-group">
                  <label className="block font-semibold text-lg">
                    Work Experience
                  </label>
                  <label className="mr-4">
                    <Field type="radio" name="workExp" value="yes" />
                    Yes
                  </label>
                  <label>
                    <Field type="radio" name="workExp" value="no" />
                    No
                  </label>
                  <ErrorMessage
                    name="workExp"
                    style={{ color: "red" }}
                    component="div"
                  />
                </div>

                <div role="group" aria-labelledby="my-radio-group">
                  <label className="block font-semibold text-lg">
                    Applying For
                  </label>
                  <label className="mr-4">
                    <Field type="radio" name="applyFor" value="permanent" />
                    Permanent
                  </label>
                  <label>
                    <Field type="radio" name="applyFor" value="internship" />
                    Internship
                  </label>
                  <ErrorMessage
                    name="applyFor"
                    style={{ color: "red" }}
                    component="div"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 w-full  my-4  gap-5">
                {values.applyFor === "Internship" && (
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

                <Field
                  component={TextField}
                  InputLabelProps={{ shrink: true }}
                  label="Applied On"
                  name="appliedOn"
                  type="date"
                />

                <Field
                  component={TextField}
                  InputLabelProps={{ shrink: true }}
                  label="Called for interview on"
                  name="interviewCall"
                  type="date"
                />
                <Field
                  component={TextField}
                  InputLabelProps={{ shrink: true }}
                  label="Interview Time"
                  name="interviewTime"
                  type="time"
                />
              </div>
              <div className="grid grid-cols-1 w-full  my-4  gap-5">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="gender-select"> Response</InputLabel>
                    <Field
                      fullWidth
                      label=" Response"
                      variant="outlined"
                      name="response"
                      as={Select}
                      onBlur={() => {}}
                    >
                      <MenuItem value="appeared">Appeared</MenuItem>
                      <MenuItem value="notAppeared">Not Appeared</MenuItem>
                      <MenuItem value="noResponse">No Response</MenuItem>
                      <MenuItem value="refused">Refused</MenuItem>
                    </Field>
                  </FormControl>
                  <ErrorMessage
                    name="response"
                    style={{ color: "red" }}
                    component="div"
                  />
                </div>
              </div>
              {values.response === "appeared" && (
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div>
                    <Typography variant="body2" component="legend">
                      Interview Rating
                    </Typography>
                    <Rating
                      name="interviewRating"
                      value={Number(values.interviewRating)}
                      onChange={(e) => {
                        const newInterviewRating = parseFloat(e.target.value);
                        setFieldValue("interviewRating", newInterviewRating);
                        setFieldValue(
                          "overallRating",
                          (newInterviewRating + values.testRating) / 2
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="body2" component="legend">
                      Test Rating
                    </Typography>
                    <Rating
                      name="testRating"
                      value={Number(values.testRating)}
                      onChange={(e) => {
                        const newTestRating = parseFloat(e.target.value);
                        setFieldValue("testRating", newTestRating);
                        setFieldValue(
                          "overallRating",
                          (values.interviewRating + newTestRating) / 2
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="body2" component="legend">
                      Overall Rating
                    </Typography>
                    <Rating
                      name="overallRating"
                      value={values.overallRating}
                      disabled
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 w-full  my-4 gap-5">
                <Field
                  label="Expected Salary"
                  component={TextField}
                  name="expectedSalary"
                  onInput={(event) => {
                    const input = event.target.value;
                    const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
                    event.target.value = formattedInput;
                  }}
                />

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

                <div className="md:flex items-center  w-full">
                  <label className="block font-semibold `">CV: </label>
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
                </div>
              </div>

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
