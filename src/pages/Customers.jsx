
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from "@mui/icons-material";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

function Customers() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    orders,
  } = useApp();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Tìm kiếm khách hàng
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search)
  );

  // Tính tổng tiền khách đã mua
  const getCustomerOrders = (customer) => {
    return orders.filter(
      (order) =>
        order.customer === customer.name &&
        order.status === "Hoàn thành"
    );
  };

  const getTotalSpent = (customer) => {
    return getCustomerOrders(customer).reduce(
      (total, order) => total + order.total,
      0
    );
  };

  // Mở form thêm
  const handleAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setOpen(true);
  };

  // Mở form sửa
  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setOpen(true);
  };

  // Lưu khách hàng
  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Vui lòng nhập tên và số điện thoại!");
      return;
    }

    const phoneRegex = /^[0-9]{9,11}$/;

    if (!phoneRegex.test(form.phone.trim())) {
      alert("Số điện thoại phải có từ 9 đến 11 chữ số!");
      return;
    }

    const duplicate = customers.some(
      (customer) =>
        customer.phone === form.phone.trim() &&
        customer.id !== editingId
    );

    if (duplicate) {
      alert("Số điện thoại đã tồn tại!");
      return;
    }

    if (editingId) {
      updateCustomer(editingId, form);
    } else {
      addCustomer(form);
    }

    setOpen(false);
  };

  // Xóa khách hàng
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      deleteCustomer(id);
    }
  };

  // Xem chi tiết
  const handleDetail = (customer) => {
    setSelectedCustomer(customer);
    setDetailOpen(true);
  };

  return (
    <Box p={3}>
      {/* Tiêu đề */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Quản lý khách hàng
          </Typography>

          <Typography color="text.secondary">
            Quản lý thông tin và lịch sử mua hàng
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Thêm khách hàng
        </Button>
      </Box>

      {/* Thống kê */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={2}
        mb={3}
      >
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Tổng khách hàng
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {customers.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Tổng đơn hàng
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {orders.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Khách hàng mới
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {customers.filter((c) => !getCustomerOrders(c).length).length}
          </Typography>
        </Paper>
      </Box>

      {/* Bảng khách hàng */}
      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm theo tên hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số đơn hàng</TableCell>
                <TableCell>Tổng chi tiêu</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {customer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.address}
                    </Typography>
                  </TableCell>

                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>

                  <TableCell>
                    {getCustomerOrders(customer).length}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(getTotalSpent(customer))}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="info"
                      onClick={() => handleDetail(customer)}
                    >
                      <Visibility />
                    </IconButton>

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy khách hàng
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Form thêm và sửa */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Cập nhật khách hàng" : "Thêm khách hàng"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Họ và tên"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Địa chỉ"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Hủy
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chi tiết khách hàng */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chi tiết khách hàng</DialogTitle>

        <DialogContent>
          {selectedCustomer && (
            <>
              <Typography>
                Họ tên: {selectedCustomer.name}
              </Typography>

              <Typography>
                Số điện thoại: {selectedCustomer.phone}
              </Typography>

              <Typography>
                Email: {selectedCustomer.email || "-"}
              </Typography>

              <Typography mb={2}>
                Địa chỉ: {selectedCustomer.address || "-"}
              </Typography>

              <Typography variant="h6" mb={1}>
                Lịch sử mua hàng
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Ngày mua</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {getCustomerOrders(selectedCustomer).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {getCustomerOrders(selectedCustomer).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Khách hàng chưa có đơn hàng
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers;
