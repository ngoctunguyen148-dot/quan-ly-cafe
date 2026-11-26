
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
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
  MenuItem,
  InputAdornment,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

const categories = ["Cà phê", "Trà", "Sinh tố", "Nước ép", "Khác"];

const emptyProduct = {
  name: "",
  category: "Cà phê",
  price: "",
  stock: "",
  image: "☕",
};

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [form, setForm] = useState(emptyProduct);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      Number(form.price) <= 0 ||
      form.price === "" ||
      Number(form.stock) < 0 ||
      form.stock === ""
    ) {
      alert("Vui lòng nhập thông tin hợp lệ!");
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId) {
      updateProduct(editingId, productData);
      alert("Cập nhật sản phẩm thành công!");
    } else {
      addProduct(productData);
      alert("Thêm sản phẩm thành công!");
    }

    handleClose();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );

    if (confirmDelete) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      filter === "Tất cả" || product.category === filter;

    return matchSearch && matchCategory;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#4E342E">
            Quản lý sản phẩm
          </Typography>

          <Typography color="text.secondary">
            Quản lý danh sách đồ uống của quán cà phê
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: "#795548" }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <Card elevation={0} sx={{ border: "1px solid #eee" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
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
              label="Danh mục"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Giá bán</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>#{product.id}</TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Typography fontSize={25}>
                        {product.image}
                      </Typography>
                      <Typography fontWeight="medium">
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>

                  <TableCell>
                    {formatCurrency(product.price)}
                  </TableCell>

                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy sản phẩm
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              margin="normal"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              select
              label="Danh mục"
              margin="normal"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Giá bán (VNĐ)"
              margin="normal"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              fullWidth
              type="number"
              label="Số lượng tồn kho"
              margin="normal"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              inputProps={{ min: 0 }}
              required
            />

            <TextField
              fullWidth
              label="Biểu tượng sản phẩm"
              margin="normal"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Hủy</Button>

            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#795548" }}
            >
              {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Products;
