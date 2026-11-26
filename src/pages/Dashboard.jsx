
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";


import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

const drinks = [
  {
    name: "Cà phê sữa đá",
    category: "Cà phê truyền thống",
    price: "Hương vị đậm đà",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },
  {
    name: "Caramel Macchiato",
    category: "Cà phê hiện đại",
    price: "Ngọt dịu, béo thơm",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600",
  },
  {
    name: "Matcha Latte",
    category: "Trà xanh",
    price: "Thanh mát mỗi ngày",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
  },
  {
    name: "Cappuccino",
    category: "Cà phê Ý",
    price: "Lớp bọt sữa mềm mịn",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600",
  },
];

function Dashboard() {
  const { products, orders } = useApp();

  const completedOrders = orders.filter(
    (order) => order.status === "Hoàn thành"
  );

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      note: "Đơn hàng hoàn thành",
      icon: <PaymentsOutlinedIcon />,
      color: "#9A6848",
      bg: "#F5E9DD",
    },
    {
      title: "Tổng đơn hàng",
      value: orders.length,
      note: "Tất cả đơn hàng",
      icon: <ShoppingBagOutlinedIcon />,
      color: "#B58A4C",
      bg: "#F8F0DF",
    },
    {
      title: "Sản phẩm",
      value: products.length,
      note: "Đang quản lý",
      icon: <Inventory2OutlinedIcon />,
      color: "#71816B",
      bg: "#EAF0E6",
    },
    {
      title: "Khách hàng",
      value: 120,
      note: "Số liệu minh họa",
      icon: <PeopleAltOutlinedIcon />,
      color: "#7A8195",
      bg: "#ECEEF5",
    },
  ];

  // Tổng hợp doanh thu theo ngày
  const revenueByDate = {};

  completedOrders.forEach((order) => {
    const date = order.date || "Không rõ ngày";

    revenueByDate[date] =
      (revenueByDate[date] || 0) + Number(order.total || 0);
  });

  const chartData = Object.entries(revenueByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, revenue]) => ({
      date,
      revenue,
    }));

  const recentOrders = [...orders].slice(-5).reverse();

  const completedPercent = orders.length
    ? (completedOrders.length / orders.length) * 100
    : 0;

  const cardStyle = {
    border: "1px solid #EEE5DA",
    borderRadius: "16px",
    boxShadow: "0 3px 14px rgba(73, 48, 32, 0.04)",
    backgroundColor: "#FFFFFF",
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        pb: 3,
        color: "#403027",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 23, md: 27 },
              fontWeight: 800,
              color: "#493326",
            }}
          >
            Tổng quan
          </Typography>

          <Typography variant="body2" color="#94877D">
            Chào mừng bạn đến với Coffee House
          </Typography>
        </Box>

        <Chip
          icon={<LocalCafeOutlinedIcon />}
          label="COFFEE HOUSE"
          sx={{
            bgcolor: "#F0E5D9",
            color: "#795548",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        />
      </Box>

      {/* HERO BANNER */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 190, md: 205 },
          borderRadius: "18px",
          overflow: "hidden",
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(90deg, rgba(48,30,22,0.96) 0%, rgba(48,30,22,0.82) 48%, rgba(48,30,22,0.12) 100%), url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1400)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: { xs: 3, md: 5 },
          py: 3,
        }}
      >
        <Box sx={{ maxWidth: 480, position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              color: "#E4BD8A",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
            }}
          >
            WELCOME TO COFFEE HOUSE
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: 25, md: 32 },
              fontWeight: 800,
              mb: 1,
              lineHeight: 1.25,
            }}
          >
            Không gian cà phê,
            <br />
            khởi đầu ngày mới!
          </Typography>

          <Typography
            sx={{
              color: "#E5D8CC",
              fontSize: 13,
              maxWidth: 390,
            }}
          >
            Theo dõi hoạt động kinh doanh và quản lý cửa hàng
            của bạn một cách dễ dàng.
          </Typography>
        </Box>
      </Box>

      {/* STATISTICS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {stats.map((item) => (
          <Card
            key={item.title}
            sx={{
              ...cardStyle,
              minWidth: 0,
              height: 132,
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 20px rgba(73,48,32,0.09)",
              },
            }}
          >
            <CardContent
              sx={{
                p: "20px !important",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#8B7D72",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 19, md: 21 },
                    fontWeight: 800,
                    color: "#493326",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.value}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#A69A90",
                    mt: 1,
                  }}
                >
                  {item.note}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 49,
                  height: 49,
                  bgcolor: item.bg,
                  color: item.color,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Avatar>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* CHART + SUMMARY */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.8fr) minmax(260px, 1fr)",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {/* REVENUE CHART */}
        <Card sx={{ ...cardStyle, minWidth: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography fontWeight={800} color="#493326">
                  Doanh thu cửa hàng
                </Typography>
                <Typography variant="caption" color="#9A8C80">
                  Theo các ngày có đơn hàng hoàn thành
                </Typography>
              </Box>

              <Chip
                label="7 ngày gần nhất"
                size="small"
                sx={{ bgcolor: "#F5EEE6", color: "#795548" }}
              />
            </Box>

            {chartData.length > 0 ? (
              <Box sx={{ width: "100%", height: 245 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="coffeeRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#A87955" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#A87955" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#F0EBE5"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#95877C" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fontSize: 10, fill: "#95877C" }}
                      axisLine={false}
                      tickLine={false}
                      width={65}
                    />

                    <Tooltip
                      formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #EEE5DA",
                        fontSize: 12,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#956747"
                      strokeWidth={3}
                      fill="url(#coffeeRevenue)"
                      activeDot={{ r: 5, fill: "#795548" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box
                sx={{
                  height: 245,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#A69A90",
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 35, mb: 1 }} />
                <Typography variant="body2">
                  Chưa có dữ liệu doanh thu
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* STORE SUMMARY */}
        <Card sx={{ ...cardStyle, minWidth: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography fontWeight={800} color="#493326">
              Tình hình cửa hàng
            </Typography>

            <Typography variant="caption" color="#9A8C80">
              Tổng hợp hoạt động hiện tại
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                my: 2.5,
                p: 2,
                borderRadius: 3,
                bgcolor: "#F8F3ED",
              }}
            >
              <Avatar sx={{ bgcolor: "#E9D9C8", color: "#795548" }}>
                <ShoppingBagOutlinedIcon />
              </Avatar>

              <Box>
                <Typography fontSize={12} color="#95877C">
                  Đơn hoàn thành
                </Typography>
                <Typography fontSize={22} fontWeight={800} color="#493326">
                  {completedOrders.length}
                  <Typography
                    component="span"
                    fontSize={13}
                    color="#9A8C80"
                    sx={{ ml: 0.7 }}
                  >
                    / {orders.length} đơn
                  </Typography>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography fontSize={12} color="#75665C">
                  Tỷ lệ hoàn thành đơn
                </Typography>
                <Typography fontSize={12} fontWeight={700} color="#795548">
                  {Math.round(completedPercent)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={completedPercent}
                sx={{
                  height: 9,
                  borderRadius: 10,
                  bgcolor: "#F0E9E1",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#82916D",
                    borderRadius: 10,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #F0EBE5",
                pt: 2,
              }}
            >
              <Box>
                <Typography fontSize={12} color="#95877C">
                  Tổng sản phẩm
                </Typography>
                <Typography fontSize={20} fontWeight={800} color="#493326">
                  {products.length}
                </Typography>
              </Box>

              <Avatar sx={{ bgcolor: "#EAF0E6", color: "#71816B" }}>
                <Inventory2OutlinedIcon />
              </Avatar>
            </Box>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: "#493326",
                color: "white",
              }}
            >
              <Typography fontSize={12} sx={{ color: "#D9C8B8" }}>
                Doanh thu đã hoàn thành
              </Typography>

              <Typography fontSize={20} fontWeight={800} sx={{ mt: 0.5 }}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* DRINK COLLECTION */}
      <Box sx={{ mb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontWeight={800} fontSize={19} color="#493326">
              Hương vị nổi bật
            </Typography>
            <Typography variant="caption" color="#9A8C80">
              Khám phá bộ sưu tập đồ uống Coffee House
            </Typography>
          </Box>

          <LocalCafeOutlinedIcon sx={{ color: "#A87955", fontSize: 26 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {drinks.map((drink) => (
          <Card
            key={drink.name}
            sx={{
              ...cardStyle,
              overflow: "hidden",
              minWidth: 0,
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(73,48,32,0.10)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={drink.image}
              alt={drink.name}
              sx={{
                height: { xs: 115, sm: 145 },
                objectFit: "cover",
              }}
            />

            <CardContent sx={{ p: "13px !important" }}>
              <Typography
                fontWeight={800}
                fontSize={13}
                color="#493326"
                noWrap
              >
                {drink.name}
              </Typography>

              <Typography
                fontSize={11}
                color="#9A8C80"
                sx={{ mt: 0.5 }}
              >
                {drink.category}
              </Typography>

              <Typography
                fontSize={11}
                color="#A87955"
                fontWeight={600}
                sx={{ mt: 1 }}
              >
                {drink.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* RECENT ORDERS */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography fontWeight={800} color="#493326">
                Đơn hàng gần đây
              </Typography>
              <Typography variant="caption" color="#9A8C80">
                Theo dõi những đơn hàng mới nhất
              </Typography>
            </Box>

            <Chip
              label={`${orders.length} đơn hàng`}
              size="small"
              sx={{ bgcolor: "#F5EEE6", color: "#795548" }}
            />
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#FAF7F3" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#75665C" }}>
                    Mã đơn
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#75665C" }}>
                    Khách hàng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#75665C" }}>
                    Ngày đặt
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#75665C" }}>
                    Tổng tiền
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#75665C" }}>
                    Trạng thái
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography fontWeight={700} color="#795548" fontSize={13}>
                          #{order.id}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={13}>
                          {order.customer || "Khách lẻ"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={12} color="#8D8178">
                          {order.date}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={13} fontWeight={700}>
                          {formatCurrency(order.total)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === "Hoàn thành"
                              ? "success"
                              : "warning"
                          }
                          sx={{ fontSize: 11 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="#A69A90" fontSize={13}>
                        Chưa có đơn hàng nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
