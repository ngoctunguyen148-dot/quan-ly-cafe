
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

function Dashboard() {
  const { products, orders } = useApp();

  const totalRevenue = orders
    .filter((order) => order.status === "Hoàn thành")
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      icon: <AttachMoneyIcon />,
      color: "#795548",
    },
    {
      title: "Tổng đơn hàng",
      value: orders.length,
      icon: <ShoppingCartIcon />,
      color: "#D7A86E",
    },
    {
      title: "Sản phẩm",
      value: products.length,
      icon: <InventoryIcon />,
      color: "#607D8B",
    },
    {
      title: "Khách hàng",
      value: 120,
      icon: <PeopleIcon />,
      color: "#78966D",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#4E342E">
        Tổng quan
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Chào mừng bạn đến với hệ thống quản lý Coffee House.
      </Typography>

      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Card elevation={0} sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {item.title}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                      {item.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: item.color,
                      color: "#fff",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ mt: 3, border: "1px solid #eee" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Đơn hàng gần đây
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "Hoàn thành"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
