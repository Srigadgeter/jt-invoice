import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PAGE_INFO } from "utils/constants";
import useBreakpoints from "hooks/useBreakpoints";

const styles = {
  titleCard: (isMobile) => ({
    p: isMobile ? 2 : 4,
    mb: 1,
    borderRadius: "15px",
    boxShadow: "common.shadowColor",
    color: (theme) => (theme.palette.mode === "dark" ? "common.black" : "common.white"),
    backgroundImage: (theme) =>
      `linear-gradient( 64.5deg, ${theme.palette.common.pink} 14.7%, ${theme.palette.primary.main} 88.7% )`
  }),
  titleIcon: (isMobile) => ({
    fontSize: isMobile ? 40 : 70
  })
};

const TitleBanner = ({ page, Icon }) => {
  const { isMobile } = useBreakpoints();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={styles.titleCard(isMobile)}>
      <Stack>
        <Typography variant={isMobile ? "h5" : "h3"}>{PAGE_INFO?.[page]?.title}</Typography>
        {!isMobile && (
          <Typography variant="body1" pl={0.25}>
            {PAGE_INFO?.[page]?.description}
          </Typography>
        )}
      </Stack>
      <Icon sx={styles.titleIcon(isMobile)} />
    </Stack>
  );
};

export default TitleBanner;
