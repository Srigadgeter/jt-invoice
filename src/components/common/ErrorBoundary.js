import React, { Component } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const styles = {
  box: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  }
};

const FallbackComponent = () => (
  <Box sx={styles.box}>
    <Typography variant="h2">Something went wrong!</Typography>
    {/* TODO: button navigation to be configured */}
    <Button>Go Back</Button>
  </Box>
);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    console.error(error);
    // eslint-disable-next-line no-console
    console.info(info);
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallbackComponent = null } = this.props;

    if (hasError) return fallbackComponent || <FallbackComponent />;
    return children;
  }
}

export default ErrorBoundary;
