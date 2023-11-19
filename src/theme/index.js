// external imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deepmerge } from "@mui/utils";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// internal imports
import themes from "./themes";

export default ({ children }) => {
  const [options, setOptions] = useState({});
  const { appTheme } = useSelector((state) => state.app);

  const themePicker = async (themeName) => {
    const selectedTheme = themes.find((item) => item === themeName);

    if (selectedTheme) {
      const { default: selectedConfig } = await import(`./${selectedTheme.toLowerCase()}`);
      return selectedConfig;
    }

    return {};
  };

  useEffect(() => {
    themePicker(appTheme).then((res) => setOptions(res));
  }, [appTheme]);

  return (
    <ThemeProvider
      theme={createTheme({
        ...options,
        components: deepmerge(
          {
            // Add all the default MUI Component Overrides here
            // It'll apply to whole project irrespective of any theme selection
            // Refer here: https://mui.com/customization/theme-components/
          },
          options.components
        )
      })}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
