import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useState } from "react";
import { object, string } from "yup";

const validationSchema = object().shape({
  disability: string()
    .required("Disability is required")
    .oneOf(["yes", "no"], "Disability must be either 'yes' or 'no'"),
  kindofdisability: string().when("disability", {
    is: "yes",
    then: (schema) => schema.required("Required Field"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Test = () => {
  const [data, setData] = useState("");
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
          <Form>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Disability</InputLabel>
              <Field name="disability" as={Select} labelId="disability-label">
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Field>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ marginTop: "30px" }}>
              <Field label="What Kind of Disability?" component={TextField} name="kindofdisability" fullWidth />
            </FormControl>

            <Button type="submit" variant="contained" sx={{ mt: 5 }}>
              Submit
            </Button>
          </Form>
        </Formik>
      </Paper>
      <Paper>
        <Typography>{data}</Typography>
      </Paper>
    </>
  );
};

export default Test;
