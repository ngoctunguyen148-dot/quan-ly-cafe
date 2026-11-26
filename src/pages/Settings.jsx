
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
} from "@mui/material";

import {
  Save,
  Download,
  Upload,
} from "@mui/icons-material";

import { useApp } from "../contexts/AppContext";

function Settings() {
  const {
    products,
    setProducts,
    orders,
    setOrders,
    categories,
    setCategories,
    customers,
    setCustomers,
    employees,
    setEmployees,
    settings,
    setSettings,
  } = useApp();

  const [form, setForm] = useState(settings);

  // Cập nhật thông tin cửa hàng
  const handleSave = () => {
    if (!form.shopName.trim()) {
      alert("Vui lòng nhập tên cửa hàng!");
      return;
    }

    if (
      !Number.isInteger(Number(form.lowStockLimit)) ||
      Number(form.lowStockLimit) < 0
    ) {
      alert("Ngưỡng cảnh báo kho phải là số nguyên không âm!");
      return;
    }

    setSettings({
      ...form,
      lowStockLimit: Number(form.lowStockLimit),
    });

    alert("Lưu cài đặt thành công!");
  };

  // Xuất dữ liệu sao lưu
  const handleExport = () => {
    const backup = {
      products,
      orders,
      categories,
      customers,
      employees,
      settings,
      inventoryHistory: JSON.parse(
        localStorage.getItem("coffee_inventory_history") || "[]"
      ),
      backupDate: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "coffee-shop-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Nhập dữ liệu khôi phục
  const handleImport = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        const valid =
          backup &&
          Array.isArray(backup.products) &&
          Array.isArray(backup.orders) &&
          Array.isArray(backup.categories) &&
          Array.isArray(backup.customers) &&
          Array.isArray(backup.employees) &&
          backup.settings &&
          typeof backup.settings === "object";

        if (!valid) {
          alert("File sao lưu không đúng định dạng!");
          return;
        }

        if (
          !window.confirm(
            "Khôi phục dữ liệu sẽ thay thế dữ liệu hiện tại. Bạn có chắc chắn?"
          )
        ) {
          return;
        }

        setProducts(backup.products);
        setOrders(backup.orders);
        setCategories(backup.categories);
        setCustomers(backup.customers);
        setEmployees(backup.employees);
        setSettings(backup.settings);

        localStorage.setItem(
          "coffee_inventory_history",
          JSON.stringify(backup.inventoryHistory || [])
        );

        setForm(backup.settings);

        alert("Khôi phục dữ liệu thành công!");
      } catch (error) {
        alert("Không thể đọc file sao lưu!");
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Cài đặt hệ thống
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Quản lý thông tin và dữ liệu cửa hàng
      </Typography>

      {/* Thông tin cửa hàng */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Thông tin cửa hàng
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên cửa hàng"
              value={form.shopName}
              onChange={(e) =>
                setForm({
                  ...form,
                  shopName: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Cài đặt kho hàng
        </Typography>

        <TextField
          label="Ngưỡng cảnh báo sắp hết hàng"
          type="number"
          value={form.lowStockLimit}
          onChange={(e) =>
            setForm({
              ...form,
              lowStockLimit: e.target.value,
            })
          }
          helperText="Sản phẩm có tồn kho bằng hoặc thấp hơn ngưỡng này sẽ được cảnh báo."
          sx={{ maxWidth: 350 }}
        />

        <Box mt={3}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Lưu cài đặt
          </Button>
        </Box>
      </Paper>

      {/* Sao lưu dữ liệu */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Sao lưu và khôi phục dữ liệu
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Sao lưu dữ liệu cửa hàng thành file JSON để lưu trữ
          hoặc khôi phục khi cần thiết.
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="success"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Sao lưu dữ liệu
          </Button>

          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
          >
            Khôi phục dữ liệu

            <input
              type="file"
              hidden
              accept=".json,application/json"
              onChange={handleImport}
            />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;
