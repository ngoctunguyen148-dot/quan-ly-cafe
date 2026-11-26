
import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Header />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
