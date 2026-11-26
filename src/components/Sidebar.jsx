
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";

import { NavLink } from "react-router-dom";

const menuItems = [
  { text: "Tổng quan", path: "/", icon: <DashboardIcon /> },
  { text: "Bán hàng", path: "/pos", icon: <PointOfSaleIcon /> },
  { text: "Sản phẩm", path: "/products", icon: <InventoryIcon /> },
  { text: "Danh mục", path: "/categories", icon: <CategoryIcon /> },
  { text: "Đơn hàng", path: "/orders", icon: <ReceiptLongIcon /> },
  { text: "Kho hàng", path: "/inventory", icon: <InventoryIcon /> },
  { text: "Khách hàng", path: "/customers", icon: <PeopleIcon /> },
  { text: "Nhân viên", path: "/employees", icon: <BadgeIcon /> },
  { text: "Báo cáo", path: "/reports", icon: <BarChartIcon /> },
  { text: "Cài đặt", path: "/settings", icon: <SettingsIcon /> },
];

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          backgroundColor: "#4E342E",
          color: "#fff",
          border: "none",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          ☕ Coffee House
        </Typography>
        <Typography variant="body2" sx={{ color: "#D7C4B8", mt: 1 }}>
          Hệ thống quản lý quán cà phê
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#795548" }} />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "#E8DCD3",
              "&.active": {
                backgroundColor: "#795548",
                color: "#fff",
              },
              "&:hover": {
                backgroundColor: "#65483D",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
