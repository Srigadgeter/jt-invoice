import * as yup from "yup";

// Schema for the AddEditExtraModal component
const addEditExtraSchema = yup.object({
  reason: yup.object({
    label: yup.string().trim(),
    value: yup.string().trim().required("Reason is required")
  }),
  newReason: yup.string().when("reason.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("New Reason is required")
        .min(3, "New Reason must be at least 3 characters")
        .max(30, "New Reason should not be more than 30 characters")
        .trim()
  }),
  amount: yup.number().required("Amount is required").positive("Amount must be a positive number")
});

export default addEditExtraSchema;
