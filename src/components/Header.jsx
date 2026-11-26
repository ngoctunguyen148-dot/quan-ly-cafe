
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#4E342E",
        borderBottom: "1px solid #eee",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Quản lý cửa hàng
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationsNoneIcon />

          <Avatar sx={{ bgcolor: "#795548" }}>
            A
          </Avatar>

          <Box>
            <Typography fontWeight="bold" variant="body2">
              Quản trị viên
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
