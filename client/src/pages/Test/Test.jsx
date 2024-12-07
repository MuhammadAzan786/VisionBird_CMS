import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useState } from "react";
import { object } from "yup";

const validationSchema = object().shape({});

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
