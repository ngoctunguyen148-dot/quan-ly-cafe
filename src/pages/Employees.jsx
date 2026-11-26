
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
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
} from "@mui/icons-material";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

function Employees() {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useApp();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    position: "Nhân viên",
    salary: "",
    status: "Đang làm",
  });

  // Tìm kiếm nhân viên
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.phone.includes(search)
  );

  // Mở form thêm
  const handleAdd = () => {
    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      email: "",
      position: "Nhân viên",
      salary: "",
      status: "Đang làm",
    });

    setOpen(true);
  };

  // Mở form sửa
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      status: employee.status,
    });

    setOpen(true);
  };

  // Lưu nhân viên
  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.salary) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!/^[0-9]{9,11}$/.test(form.phone.trim())) {
      alert("Số điện thoại phải có từ 9 đến 11 chữ số!");
      return;
    }

    const salary = Number(form.salary);

    if (!Number.isFinite(salary) || salary < 0) {
      alert("Lương không hợp lệ!");
      return;
    }

    const duplicate = employees.some(
      (employee) =>
        employee.phone === form.phone.trim() &&
        employee.id !== editingId
    );

    if (duplicate) {
      alert("Số điện thoại đã tồn tại!");
      return;
    }

    const employeeData = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      salary,
    };

    if (editingId) {
      updateEmployee(editingId, employeeData);
    } else {
      addEmployee(employeeData);
    }

    setOpen(false);
  };

  // Xóa nhân viên
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      deleteEmployee(id);
    }
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
            Quản lý nhân viên
          </Typography>

          <Typography color="text.secondary">
            Quản lý thông tin và chức vụ nhân viên
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Thêm nhân viên
        </Button>
      </Box>

      {/* Thống kê */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
        gap={2}
        mb={3}
      >
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Tổng nhân viên
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {employees.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Đang làm việc
          </Typography>
          <Typography variant="h4" color="success.main">
            {employees.filter((e) => e.status === "Đang làm").length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Đã nghỉ
          </Typography>
          <Typography variant="h4" color="error.main">
            {employees.filter((e) => e.status === "Đã nghỉ").length}
          </Typography>
        </Paper>
      </Box>

      {/* Bảng nhân viên */}
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
                <TableCell>Họ và tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Lương</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.email || "-"}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    {formatCurrency(employee.salary)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={
                        employee.status === "Đang làm"
                          ? "success"
                          : "default"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(employee)}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không tìm thấy nhân viên
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Form thêm / sửa */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}
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
            select
            fullWidth
            margin="normal"
            label="Chức vụ"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value })
            }
          >
            <MenuItem value="Quản lý">Quản lý</MenuItem>
            <MenuItem value="Thu ngân">Thu ngân</MenuItem>
            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Lương (VNĐ)"
            type="number"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Trạng thái"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <MenuItem value="Đang làm">Đang làm</MenuItem>
            <MenuItem value="Đã nghỉ">Đã nghỉ</MenuItem>
          </TextField>
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
    </Box>
  );
}

export default Employees;
