import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import axios from "../../../../utils/axiosInterceptor";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  loanAmount: Yup.number()
    .min(1000, "loan cannot be less then 1000")
    .required("this field is required"),
  loanPayback: Yup.string()
    .oneOf(["full", "installments"])
    .required("this field is required"),
  loanReason: Yup.string().required("this field is required"),
});

const LoanComponent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const handleSubmit = async (values) => {
    console.log(values);

    try {
      const res = await axios.post("/api/advance_payments/loan/request", {
        ...values,
        currentUser,
      });

      toast.success(res.data.msg, { duration: 3000 });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg, { duration: 5000 });
      } else {
        toast.error("There is an error requesting for a loan", {
          duration: 3000,
        });
      }
    }
  };
  const initialValues = {
    loanAmount: 1000,
    loanPayback: "full",
    loanReason: "",
    installmentDuration: 0,
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Stack spacing={3}>
            <Field name="loanAmount">
              {({ field, meta }) => (
                <TextField
                  label="Your Amount"
                  type="number"
                  fullWidth
                  {...field}
                  error={Boolean(meta.error)}
                  helperText={
                    meta.error ? meta.error : "Specify your loan amount?"
                  }
                />
              )}
            </Field>

            <FormControl component="fieldset">
              <FormLabel component="legend">
                How would you like to payback the loan?
              </FormLabel>
              <Field as={RadioGroup} name="loanPayback" row>
                <FormControlLabel
                  value="full"
                  control={<Radio />}
                  label="Full Payback"
                />
                <FormControlLabel
                  value="installments"
                  control={<Radio />}
                  label="Installments"
                />
              </Field>
            </FormControl>

            {values.loanPayback === "installments" && (
              <Field name="installmentDuration">
                {({ field, meta }) => (
                  <TextField
                    label="Installment Plan"
                    type="number"
                    fullWidth
                    {...field}
                    error={Boolean(meta.error)}
                    helperText={
                      meta.error
                        ? meta.error
                        : "In how many installments you would like to payback the loan?"
                    }
                  />
                )}
              </Field>
            )}

            <Field name="loanReason">
              {({ field, meta }) => (
                <TextField
                  label="Specify your reason"
                  multiline
                  minRows={3}
                  fullWidth
                  {...field}
                  error={Boolean(meta.error)}
                  helperText={
                    meta.error
                      ? "this field is required"
                      : "Why do you want to apply for the loan?"
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

export default LoanComponent;
