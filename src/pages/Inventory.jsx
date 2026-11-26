import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Search,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

import { useApp } from "../contexts/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";

function Inventory() {
  const { products, setProducts } = useApp();

  const [history, setHistory] = useLocalStorage(
    "coffee_inventory_history",
    []
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("Nhập kho");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchFilter = true;

    if (filter === "low") {
      matchFilter = product.stock > 0 && product.stock <= 10;
    }

    if (filter === "out") {
      matchFilter = product.stock <= 0;
    }

    return matchSearch && matchFilter;
  });

  // Tổng số sản phẩm
  const totalProducts = products.length;

  // Sản phẩm sắp hết
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 10
  ).length;

  // Sản phẩm hết hàng
  const outOfStock = products.filter(
    (product) => product.stock <= 0
  ).length;

  // Mở form
  const handleOpen = () => {
    setProductId("");
    setType("Nhập kho");
    setQuantity("");
    setReason("");
    setOpen(true);
  };

  // Xử lý nhập xuất kho
  const handleSubmit = () => {
    const amount = Number(quantity);

    if (!productId || !Number.isInteger(amount) || amount <= 0) {
      alert("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ!");
      return;
    }

    const product = products.find(
      (item) => item.id === Number(productId)
    );

    if (!product) {
      alert("Không tìm thấy sản phẩm!");
      return;
    }

    if (type === "Xuất kho" && amount > product.stock) {
      alert("Số lượng xuất vượt quá tồn kho!");
      return;
    }

    const newStock =
      type === "Nhập kho"
        ? product.stock + amount
        : product.stock - amount;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, stock: newStock }
          : item
      )
    );

    const newHistory = {
      id: Date.now(),
      productName: product.name,
      type,
      quantity: amount,
      reason: reason || "Không có ghi chú",
      date: new Date().toLocaleString("vi-VN"),
    };

    setHistory((prev) => [newHistory, ...prev]);

    setOpen(false);
    alert("Cập nhật kho hàng thành công!");
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Quản lý kho hàng
          </Typography>

          <Typography color="text.secondary">
            Theo dõi nhập, xuất và tồn kho sản phẩm
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Nhập / Xuất kho
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
            Tổng sản phẩm
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {totalProducts}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Sắp hết hàng
          </Typography>
          <Typography variant="h4" color="warning.main">
            {lowStock}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Hết hàng
          </Typography>
          <Typography variant="h4" color="error.main">
            {outOfStock}
          </Typography>
        </Paper>
      </Box>

      {/* Danh sách kho */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Danh sách tồn kho
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            size="small"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
            fullWidth
          />

          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="low">Sắp hết hàng</MenuItem>
            <MenuItem value="out">Hết hàng</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell align="center">Tồn kho</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image} {product.name}
                  </TableCell>

                  <TableCell>{product.category}</TableCell>

                  <TableCell align="center">
                    {product.stock}
                  </TableCell>

                  <TableCell align="center">
                    {product.stock <= 0 ? (
                      <Chip label="Hết hàng" color="error" />
                    ) : product.stock <= 10 ? (
                      <Chip label="Sắp hết" color="warning" />
                    ) : (
                      <Chip label="Còn hàng" color="success" />
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không tìm thấy sản phẩm
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Lịch sử */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Lịch sử nhập xuất kho
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Loại giao dịch</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.productName}</TableCell>

                  <TableCell>
                    <Chip
                      label={item.type}
                      color={
                        item.type === "Nhập kho"
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    {item.quantity}
                  </TableCell>

                  <TableCell>{item.reason}</TableCell>
                </TableRow>
              ))}

              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Chưa có lịch sử nhập xuất kho
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Form nhập xuất */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nhập / Xuất kho</DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Chọn sản phẩm"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name} (Tồn: {product.stock})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Loại giao dịch"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Nhập kho">Nhập kho</MenuItem>
            <MenuItem value="Xuất kho">Xuất kho</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Số lượng"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Ghi chú"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Nhập hàng từ nhà cung cấp"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;
