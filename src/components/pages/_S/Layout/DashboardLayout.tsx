import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "#F4F8FA",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "280px",
            background: "#F4F8FA",
            borderRadius: "0 0 50% 50% / 0 0 30px 30px",
            zIndex: 0,
            pointerEvents: "none",
          },
        }}
      >
        <Header />
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            minWidth: 0,
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "none",
              px: { xs: 2, sm: 3 },
              py: 3,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
