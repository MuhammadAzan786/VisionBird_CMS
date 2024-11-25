import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { TextField } from "formik-material-ui";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { object } from "yup";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { loginSuccess } from "../redux/user/userSlice";
import { initializeSocket } from "../redux/socketSlice";
import { clearSocket } from "../redux/socketSlice";
import axios from "axios";
import toast from "react-hot-toast";
import CustomOverlay from "../components/Styled/CustomOverlay";

const validationSchema = object().shape({});
const LOGIN_URL = "/api/auth/sign-in";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    if (error && error.status === 404) {
      toast.error("Invalid User");
    } else if (error && error.status === 400) {
      toast.error("Invalid Password");
    } else {
      toast.error("Login Failed");
    }

    // showMessage("error", "Login failed.");
  };

  useEffect(() => {
    dispatch(clearSocket());
    localStorage.removeItem("persist:user");
    dispatch(signOut());
  }, []);

  return (
    <>
      {loading && <CustomOverlay open={true} />}
      <Formik
        initialValues={{
          userName: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const data = {
            employeeUsername: values.userName,
            employeePassword: values.password,
          };

          axios
            .post(LOGIN_URL, data, {
              withCredentials: true,
            })
            .then((res) => {
              setLoading(true);
              navigate("/");
              dispatch(loginSuccess(res.data));
              dispatch(initializeSocket(res.data));
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              handleError(error);
              console.log(error);
            });
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container component="main" sx={{ height: "100vh" }}>
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage: "url(/vbt.jpg)",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <Box
                  sx={{
                    mx: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Field
                      component={TextField}
                      margin="normal"
                      required
                      fullWidth
                      id="userName"
                      label="Username"
                      name="userName"
                      autoComplete="userName"
                      autoFocus
                    />
                    <Field
                      component={TextField}
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="password"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
