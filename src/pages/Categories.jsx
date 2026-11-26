
import React, { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useApp } from "../contexts/AppContext";

function Categories() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useApp();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();

    if (!name) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== editingId
    );

    if (duplicate) {
      alert("Danh mục này đã tồn tại!");
      return;
    }

    if (editingId) {
      const oldCategory = categories.find(
        (category) => category.id === editingId
      );

      updateCategory(editingId, {
        ...form,
        name,
      });

      // Cập nhật tên danh mục trong các sản phẩm liên quan
      products.forEach((product) => {
        if (product.category === oldCategory.name) {
          // Việc cập nhật sản phẩm sẽ được thực hiện ở bước kết nối
        }
      });

      alert("Cập nhật danh mục thành công!");
    } else {
      addCategory({
        ...form,
        name,
      });

      alert("Thêm danh mục thành công!");
    }

    setOpen(false);
  };

  const handleDelete = (category) => {
    const hasProducts = products.some(
      (product) => product.category === category.name
    );

    if (hasProducts) {
      alert("Không thể xóa danh mục đang có sản phẩm!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteCategory(category.id);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

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
            Quản lý danh mục
          </Typography>

          <Typography color="text.secondary">
            Quản lý các nhóm đồ uống của cửa hàng
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: "#795548" }}
        >
          Thêm danh mục
        </Button>
      </Box>

      <Card elevation={0} sx={{ border: "1px solid #eee" }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã danh mục</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Số sản phẩm</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>#{category.id}</TableCell>

                  <TableCell>
                    <Typography fontWeight="bold">
                      {category.name}
                    </Typography>
                  </TableCell>

                  <TableCell>{category.description}</TableCell>

                  <TableCell>
                    {
                      products.filter(
                        (product) =>
                          product.category === category.name
                      ).length
                    }
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không tìm thấy danh mục
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Tên danh mục"
              margin="normal"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              label="Mô tả"
              margin="normal"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#795548" }}
            >
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Categories;
