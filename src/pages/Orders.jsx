
import React, { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

function Orders() {
  const {
    orders,
    setOrders,
    products,
    setProducts,
  } = useApp();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tìm kiếm và lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      String(order.id).includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);

    const matchStatus =
      filter === "Tất cả" || order.status === filter;

    return matchSearch && matchStatus;
  });

  // Xem chi tiết đơn hàng
  const handleView = (order) => {
    setSelectedOrder(order);
  };

  // Hủy đơn hàng và hoàn lại tồn kho
  const handleCancel = (order) => {
    if (order.status === "Đã hủy") {
      alert("Đơn hàng này đã bị hủy!");
      return;
    }

    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy đơn hàng #${order.id}?`
    );

    if (!confirmCancel) return;

    // Hoàn lại số lượng sản phẩm vào kho
    if (order.items && order.items.length > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const orderItem = order.items.find(
            (item) => item.productId === product.id
          );

          return orderItem
            ? {
                ...product,
                stock: product.stock + orderItem.quantity,
              }
            : product;
        })
      );
    }

    // Cập nhật trạng thái đơn hàng
    setOrders((prevOrders) =>
      prevOrders.map((item) =>
        item.id === order.id
          ? { ...item, status: "Đã hủy" }
          : item
      )
    );

    setSelectedOrder(null);

    alert("Đã hủy đơn hàng và hoàn lại tồn kho!");
  };

  const getStatusColor = (status) => {
    if (status === "Hoàn thành") return "success";
    if (status === "Đang xử lý") return "warning";
    return "error";
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#4E342E">
        Quản lý đơn hàng
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Theo dõi và quản lý các đơn hàng của cửa hàng
      </Typography>

      <Card elevation={0} sx={{ border: "1px solid #eee" }}>
        <CardContent>
          {/* Tìm kiếm và lọc */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              placeholder="Tìm mã đơn hoặc tên khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, minWidth: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Trạng thái"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
              <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
              <MenuItem value="Đã hủy">Đã hủy</MenuItem>
            </TextField>
          </Box>

          {/* Bảng đơn hàng */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>

                  <TableCell>{order.customer}</TableCell>

                  <TableCell>{order.date}</TableCell>

                  <TableCell>
                    {formatCurrency(order.total)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleView(order)}
                      title="Xem chi tiết"
                    >
                      <VisibilityIcon />
                    </IconButton>

                    {order.status !== "Đã hủy" && (
                      <IconButton
                        color="error"
                        onClick={() => handleCancel(order)}
                        title="Hủy đơn hàng"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy đơn hàng
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chi tiết đơn hàng */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Chi tiết đơn hàng #{selectedOrder.id}
            </DialogTitle>

            <DialogContent>
              <Typography>
                Khách hàng: <b>{selectedOrder.customer}</b>
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Ngày đặt: {selectedOrder.date}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Trạng thái: {selectedOrder.status}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Danh sách sản phẩm
              </Typography>

              {selectedOrder.items?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>

                  <Typography>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              {!selectedOrder.items?.length && (
                <Typography color="text.secondary">
                  Đơn hàng mẫu chưa có thông tin sản phẩm chi tiết.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight="bold">
                  Tổng thanh toán
                </Typography>

                <Typography fontWeight="bold" color="primary">
                  {formatCurrency(selectedOrder.total)}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>
                Đóng
              </Button>

              {selectedOrder.status !== "Đã hủy" && (
                <Button
                  color="error"
                  onClick={() => handleCancel(selectedOrder)}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Orders;
