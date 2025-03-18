import React from "react";
import { Box, Typography } from "@mui/material";

const Logo = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ marginX: 2 }}
    >
      {/* โลโก้ */}
      <Box
        component="img"
        src="/bls-header-logo.png"
        alt="Bualuang Securities Logo"
        sx={{ width: 25, height: "auto", mr: 1 }}
      />
      
      {/* ข้อความ */}
      <Box>
        <Typography
          variant="h6"
          sx={{ color: "#c02032", fontWeight: "bold", lineHeight: 1 }}
        >
          BUALUANG
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: "bold", lineHeight: 1 }}
        >
          SECURITIES
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
