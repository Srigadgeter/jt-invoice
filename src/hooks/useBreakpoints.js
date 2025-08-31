import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useBreakpoints = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "xl"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  return { isMobile, isTablet, isLaptop, isDesktop };
};

export default useBreakpoints;
