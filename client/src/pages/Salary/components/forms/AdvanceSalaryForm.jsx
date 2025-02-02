import { Field, Form, Formik } from "formik";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import * as yup from "yup";
import { useSelector } from "react-redux";
import axios from "../../../../utils/axiosInterceptor";
import toast from "react-hot-toast";

const SalarySchema = yup.object({
  advanceSalaryMonths: yup.number().required("this field is required"),
  advanceSalaryReason: yup.string().required("this field is required"),
});

const AdvanceSalary = () => {
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const res = await axios.post("/api/advance_payments/advance/salary/request", {
        ...values,
        currentUser,
      });

      toast.success(res.data.msg, { duration: 3000 });
      setSubmitting(false);
      resetForm();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg, { duration: 5000 });
      } else {
        toast.error("Error making salary request", {
          duration: 3000,
        });
      }
    }
  };
  const initialValues = {
    advanceSalaryMonths: 1,
    advanceSalaryReason: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={SalarySchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={3}>
            <Field name="advanceSalaryMonths">
              {({ field, meta }) => (
                <TextField
                  select
                  label="Select Months"
                  fullWidth
                  {...field}
                  error={Boolean(meta.error)}
                  helperText="How many months of advance salary do you need?"
                >
                  <MenuItem value={1}>One Month</MenuItem>
                  <MenuItem value={2}>Two Month</MenuItem>
                  <MenuItem value={3}>Three Month</MenuItem>
                </TextField>
              )}
            </Field>

            <Field name="advanceSalaryReason">
              {({ field, meta }) => (
                <TextField
                  label="Specify your reason"
                  multiline
                  minRows={3}
                  fullWidth
                  {...field}
                  error={Boolean(meta.error)}
                  helperText={
                    meta.error ? "this field is required" : "Why do you want to apply for the advance salary?"
                  }
                />
              )}
            </Field>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Submit
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default AdvanceSalary;
