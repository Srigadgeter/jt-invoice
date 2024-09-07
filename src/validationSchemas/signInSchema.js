import * as yup from "yup";

// Schema for the Sign In page
const signInSchema = yup.object({
  email: yup.string().email().required("Email is required").trim(),
  password: yup.string().required("Password is required").trim()
});

export default signInSchema;
