
import React, { useMemo } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

function Reports() {
  const { orders } = useApp();

  // Chỉ tính đơn hàng đã hoàn thành
  const completedOrders = orders.filter(
    (order) => order.status === "Hoàn thành"
  );

  // Tổng doanh thu
  const totalRevenue = completedOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  // Tổng số đơn hàng hoàn thành
  const totalOrders = completedOrders.length;

  // Giá trị trung bình mỗi đơn
  const averageOrder =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Doanh thu 6 tháng gần nhất
  const monthlyRevenue = useMemo(() => {
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      const revenue = completedOrders
        .filter((order) => {
          const orderDate = new Date(order.date);

          return (
            !isNaN(orderDate.getTime()) &&
            orderDate.getMonth() === month &&
            orderDate.getFullYear() === year
          );
        })
        .reduce(
          (total, order) => total + Number(order.total || 0),
          0
        );

      result.push({
        month: `T${month + 1}/${year}`,
        revenue,
      });
    }

    return result;
  }, [completedOrders]);

  // Thống kê trạng thái đơn hàng
  const statusData = [
    {
      name: "Hoàn thành",
      value: orders.filter(
        (order) => order.status === "Hoàn thành"
      ).length,
    },
    {
      name: "Đang xử lý",
      value: orders.filter(
        (order) => order.status === "Đang xử lý"
      ).length,
    },
    {
      name: "Đã hủy",
      value: orders.filter(
        (order) => order.status === "Đã hủy"
      ).length,
    },
  ].filter((item) => item.value > 0);

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  // Thống kê sản phẩm bán chạy
  const bestSellingProducts = useMemo(() => {
    const productMap = {};

    completedOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = 0;
        }

        productMap[item.name] += Number(item.quantity || 0);
      });
    });

    return Object.keys(productMap)
      .map((name) => ({
        name,
        quantity: productMap[name],
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [completedOrders]);

  return (
    <Box p={3}>
      {/* Tiêu đề */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Báo cáo và thống kê
        </Typography>

        <Typography color="text.secondary">
          Theo dõi tình hình kinh doanh của quán cà phê
        </Typography>
      </Box>

      {/* Các thẻ thống kê */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Tổng doanh thu
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
            >
              {formatCurrency(totalRevenue)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Đơn hàng hoàn thành
            </Typography>

            <Typography variant="h5" fontWeight="bold">
              {totalOrders}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Giá trị trung bình mỗi đơn
            </Typography>

            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(averageOrder)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Biểu đồ doanh thu */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Doanh thu 6 tháng gần nhất
        </Typography>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) => formatCurrency(value)}
            />

            <Bar
              dataKey="revenue"
              name="Doanh thu"
              fill="#795548"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Hai biểu đồ phía dưới */}
      <Grid container spacing={2}>
        {/* Sản phẩm bán chạy */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Top 5 sản phẩm bán chạy
            </Typography>

            {bestSellingProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bestSellingProducts}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis type="number" />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="quantity"
                    name="Số lượng bán"
                    fill="#D7A86E"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Chưa có dữ liệu sản phẩm bán ra.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Trạng thái đơn hàng */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Trạng thái đơn hàng
            </Typography>

            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">
                Chưa có đơn hàng.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;
