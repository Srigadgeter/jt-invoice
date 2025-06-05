import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useBreakpoints = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("mobile", "tablet"));
  const isTablet = useMediaQuery(theme.breakpoints.between("tablet", "laptop"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("laptop", "desktop"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("desktop"));

  return { isMobile, isTablet, isLaptop, isDesktop };
};

export default useBreakpoints;
