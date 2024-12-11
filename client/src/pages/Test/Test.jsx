import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object } from "yup";

const validationSchema = object().shape({});

const Test = () => {
  const [data, setData] = useState("");
  console.log("testing condition", import.meta.env.VITE_NODE_ENV === "development");

  localStorage.setItem("session", "ended");
  const item = localStorage.getItem("session");

  useEffect(() => {
    if (item) {
      toast.error("Your session has ended. Please log in again.");
    }
  }, [item]);

  return (
    <>
      <Paper>
        <Formik
          initialValues={{
            disability: "no",
            kindofdisability: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setData(JSON.stringify(values));
            console.log(values);
          }}
        >
          {() => (
            <Form>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="disability">Disability</InputLabel>
                <Field name="disability" as={Select} labelId="disability-label">
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Field>
              </FormControl>

              <Field label="What Kind of Disability?" name="kindofdisability" fullWidth component={TextField} />

              <Button type="submit" variant="contained" sx={{ mt: 5 }}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Paper>
        <Typography>{data}</Typography>
      </Paper>
    </>
  );
};

export default Test;
