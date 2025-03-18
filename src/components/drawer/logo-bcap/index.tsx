import React from "react";
import { Box, Typography } from "@mui/material";

const LogoHeader = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ marginX: 2 }}
        >
            {/* Logo Image */}
            <Box
                component="img"
                src="/bcap-header-logo.png" // แก้ไขให้ตรงกับ path รูปจริง
                alt="BCAP Logo"
                sx={{ width: 30, height: "auto", marginRight: 1 }}
            />
            <Box>
                <Typography
                    variant="h5"
                    sx={{ color: "#FFF", fontWeight: "bold", lineHeight: 1 }}
                >
                    BCAP
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "#AAA", lineHeight: 1}}
                >
                    ASSET MANAGEMENT
                </Typography>
            </Box>
        </Box>
    );
};

export default LogoHeader;