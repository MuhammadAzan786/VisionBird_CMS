/* eslint-disable react/prop-types */
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, TextField } from "@mui/material";

import FormHeader from "../../components/FormHeader";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { RadioGroup } from "formik-material-ui";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const initialValues = {
  basicSalary: 30000,
  loanAmount: 0,
  repaymentMethod: "salaryDeduction",
  numberOfInstallments: 1,
  amountPerInstallment: 0,
  reasonForAdvance: "",
};

const AdvanceForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Box sx={{ px: "200px" }}>
      <Paper>
        <FormHeader title={"Loan and Advance Salary Request Form"} />
        <Formik
          initialValues={initialValues}
          validate={customValidator}
          onSubmit={async (values) => {
            console.log("values:", values);
            try {
              const res = await axios.post(`/api/advance_payments/advance_request/${currentUser._id}`, { values });
              const { message } = res.data;
              toast.success(message);
            } catch (error) {
              console.log(error);
              toast.error("Erro creating request");
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Starting Grid */}
                <Grid item xs={6}>
                  <Field
                    name="basicSalary"
                    as={TextField}
                    label="Basic Salary"
                    type="number"
                    fullWidth
                    disabled
                    defaultValue={values.basicSalary}
                  ></Field>
                </Grid>

                <Grid item xs={6}>
                  <Field
                    name="loanAmount"
                    label="Loan Amount"
                    as={TextField}
                    fullWidth
                    type="number"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!value || value < 0) {
                        setFieldValue("loanAmount", 0);
                        return;
                      }
                      setFieldValue("loanAmount", value);
                      if (value > 0 && values.numberOfInstallments > 0) {
                        setFieldValue("amountPerInstallment", Math.round(value / values.numberOfInstallments));
                      } else {
                        setFieldValue("amountPerInstallment", values.loanAmount);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">How would you like to repay?</FormLabel>
                    <Field name="repaymentMethod" component={RadioGroup} row>
                      <FormControlLabel value="salaryDeduction" control={<Radio />} label="Salary Deduction" />
                      <FormControlLabel value="directPayment" control={<Radio />} label="Direct Payment" />
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormLabel>Repayment Plan</FormLabel>
                  <Field
                    sx={{ mt: 2 }}
                    name="numberOfInstallments"
                    label="Number of Installments"
                    as={TextField}
                    fullWidth
                    type="number"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!value || value < 1) {
                        setFieldValue("numberOfInstallments", 1);
                        return;
                      }
                      setFieldValue("numberOfInstallments", value);
                      if (value && values.loanAmount) {
                        setFieldValue("amountPerInstallment", Math.round(values.loanAmount / value));
                      } else {
                        setFieldValue("amountPerInstallment", values.loanAmount);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="amountPerInstallment"
                    label="Amount per Installment"
                    as={TextField}
                    fullWidth
                    value={values.amountPerInstallment}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mt: 5 }}
                  />

                  <CustomErrorMessage name="amountPerInstallment" />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="reasonForAdvance"
                    label="Reason for Advance"
                    as={TextField}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                  <CustomErrorMessage name="reasonForAdvance" />
                </Grid>

                {/* Final Grid */}
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: "20px" }}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

const customValidator = (values) => {
  const errors = {};
  if (values.amountPerInstallment > values.basicSalary) {
    errors.amountPerInstallment = "Amount per installment cannot be greater than basic salary.";
  }
  if (!values.reasonForAdvance) {
    errors.reasonForAdvance = "This Field Is Required";
  }
  return errors;
};

const CustomErrorMessage = ({ name }) => {
  return <ErrorMessage name={name} component={"div"} style={{ color: "red", marginTop: "5px" }} />;
};

export default AdvanceForm;
