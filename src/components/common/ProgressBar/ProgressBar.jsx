import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const ProgressBar = ({ visible }) => {
  if (!visible) return null;
  return (
    <Box
      sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1200 }}
    >
      <LinearProgress color="primary" />
    </Box>
  );
};

export default ProgressBar;
