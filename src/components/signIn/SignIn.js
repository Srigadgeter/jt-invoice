import React, { useState } from "react";
import { useFormik } from "formik";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "integrations/firebase";
import Loader from "components/common/Loader";
import { setUser } from "store/slices/appSlice";
import signInSchema from "validationSchemas/signInSchema";

import Logo from "assets/svg/logo.svg";
import routes from "routes/routes";

const styles = {
  stack: {
    width: "100%",
    height: "100vh",
    backgroundImage: "linear-gradient(to top, #f77062 0%, #fe5196 100%)"
  },
  stack2: {
    width: 500,
    borderRadius: 1,
    borderBottom: (theme) => `7px solid ${theme.palette.secondary.light}`
  },
  logo: {
    width: 100,
    height: 100
  },
  button: {
    my: 1
  }
};

const INITIAL_VALUES = {
  email: "",
  password: ""
};

const SignIn = () => {
  const [isLoading, setLoader] = useState(false);

  const { HOME } = routes;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    enableReinitialize: true,
    initialValues: INITIAL_VALUES,
    validationSchema: signInSchema,
    onSubmit: async (val, { setErrors }) => {
      setLoader(true);
      try {
        // sign in using firebase auth
        const userCredential = await signInWithEmailAndPassword(auth, val?.email, val?.password);

        // store the user info
        dispatch(setUser(userCredential?.user));

        // navigate to home page in the private routes
        navigate(HOME.to());

        // reset the form
        resetForm();
      } catch (error) {
        setErrors({
          email: "Please correct your email or password and try again",
          password: "Please correct your email or password and try again"
        });
      } finally {
        setLoader(false);
      }
    }
  });

  return (
    <Stack justifyContent="center" alignItems="center" sx={styles.stack}>
      {isLoading && <Loader height="100vh" />}
      <Paper elevation={5}>
        <Stack justifyContent="center" alignItems="center" gap={3} p={5} pb={6} sx={styles.stack2}>
          <Avatar
            src={Logo}
            variant="square"
            sx={styles.logo}
            alt={process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}
          />
          <TextField
            fullWidth
            type="email"
            id="email"
            name="email"
            label="Email"
            margin="dense"
            onBlur={handleBlur}
            disabled={isLoading}
            onChange={handleChange}
            value={values?.email ?? ""}
            helperText={touched?.email && errors?.email}
            error={touched?.email && Boolean(errors?.email)}
          />
          <TextField
            fullWidth
            type="password"
            id="password"
            name="password"
            label="Password"
            margin="dense"
            onBlur={handleBlur}
            disabled={isLoading}
            onChange={handleChange}
            value={values?.password ?? ""}
            helperText={touched?.password && errors?.password}
            error={touched?.password && Boolean(errors?.password)}
          />
          <Button
            fullWidth
            sx={styles.button}
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || !(dirty && isValid)}>
            Sign In
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SignIn;
