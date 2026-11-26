import React, { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PaymentsIcon from "@mui/icons-material/Payments";

import { useApp } from "../contexts/AppContext";
import formatCurrency from "../utils/formatCurrency";

// CẤU HÌNH TÀI KHOẢN TPBANK
const BANK_ACCOUNT = "10027062007";
const BANK_ACCOUNT_NAME = "NGUYEN DO KHANH TRINH";
const BANK_BIN = "970423";

// Ảnh đồ uống
const getDrinkImage = (product) => {
  if (product.imageUrl) return product.imageUrl;

  const name = (product.name || "").toLowerCase();

  if (name.includes("đen")) {
    return "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500";
  }

  if (name.includes("sữa") || name.includes("bạc xỉu")) {
    return "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500";
  }

  if (name.includes("trà đào") || name.includes("đào")) {
    return "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500";
  }

  if (name.includes("trà sữa")) {
    return "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500";
  }

  if (name.includes("sinh tố") || name.includes("dâu")) {
    return "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500";
  }

  return "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500";
};

function POS() {
  const { products, setProducts, addOrder } = useApp();

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Trạng thái thanh toán
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [transferContent, setTransferContent] = useState("");

  // Danh sách danh mục
  const categories = [
    "Tất cả",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchName = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "Tất cả" ||
        product.category === selectedCategory;

      return matchName && matchCategory;
    });
  }, [products, search, selectedCategory]);

  // Tổng tiền
  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  // Thêm vào giỏ hàng
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Số lượng vượt quá tồn kho!");
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { ...product, quantity: 1 },
      ]);
    }
  };

  // Tăng số lượng
  const increaseQuantity = (id) => {
    const item = cart.find((product) => product.id === id);
    const product = products.find((product) => product.id === id);

    if (!item || !product || item.quantity >= product.stock) {
      alert("Không đủ hàng trong kho!");
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Giảm số lượng
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Xóa sản phẩm
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Kiểm tra và mở lựa chọn thanh toán
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    const insufficient = cart.find((item) => {
      const product = products.find((p) => p.id === item.id);
      return !product || product.stock < item.quantity;
    });

    if (insufficient) {
      alert(`Sản phẩm ${insufficient.name} không đủ tồn kho!`);
      return;
    }

    setOpenPaymentDialog(true);
  };

  // Lưu đơn hàng và trừ tồn kho
  const completeCheckout = (paymentMethod) => {
    const order = {
      customer: customer.trim() || "Khách lẻ",

      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),

      total,
      paymentMethod,
      status: "Hoàn thành",
      date: new Date().toLocaleDateString("en-CA"),
    };

    addOrder(order);

    // Trừ tồn kho
    setProducts((prev) =>
      prev.map((product) => {
        const cartItem = cart.find(
          (item) => item.id === product.id
        );

        return cartItem
          ? {
              ...product,
              stock: product.stock - cartItem.quantity,
            }
          : product;
      })
    );

    setOpenPaymentDialog(false);
    setOpenQrDialog(false);

    setCart([]);
    setCustomer("");
    setTransferContent("");

    alert("Thanh toán thành công! Đơn hàng đã được lưu.");
  };

  // Chọn thanh toán QR
  const handleChooseQr = () => {
    const content = `THANH TOAN-${Date.now()}`;

    setTransferContent(content);
    setOpenPaymentDialog(false);
    setOpenQrDialog(true);
  };

  // Kiểm tra cấu hình tài khoản
  const hasBankConfig =
    BANK_ACCOUNT !== "NHAP_SO_TAI_KHOAN" &&
    BANK_ACCOUNT.trim() !== "" &&
    BANK_ACCOUNT_NAME !== "TEN_CHU_TAI_KHOAN" &&
    BANK_ACCOUNT_NAME.trim() !== "";

  // Tạo đường dẫn mã QR
  const qrUrl = hasBankConfig
    ? `https://img.vietqr.io/image/${BANK_BIN}-${BANK_ACCOUNT}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(
        transferContent
      )}&accountName=${encodeURIComponent(BANK_ACCOUNT_NAME)}`
    : "";

  return (
    <Box>
      {/* TIÊU ĐỀ */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#4E342E">
          Bán hàng tại quầy
        </Typography>

        <Typography color="text.secondary">
          Chọn đồ uống và tạo đơn hàng mới
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.7fr) minmax(320px, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* DANH SÁCH ĐỒ UỐNG */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #eee",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Menu đồ uống
            </Typography>

            {/* Tìm kiếm */}
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm đồ uống..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Danh mục */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  onClick={() => setSelectedCategory(category)}
                  color={
                    selectedCategory === category
                      ? "primary"
                      : "default"
                  }
                  variant={
                    selectedCategory === category
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              ))}
            </Box>

            {/* Thẻ sản phẩm */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  variant="outlined"
                  onClick={() => addToCart(product)}
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    borderRadius: 3,
                    transition: "0.2s",
                    "&:hover": {
                      borderColor: "#795548",
                      transform: "translateY(-4px)",
                      boxShadow: "0 5px 18px rgba(0,0,0,0.09)",
                    },
                    opacity: product.stock <= 0 ? 0.6 : 1,
                  }}
                >
                  <Box
                    component="img"
                    src={getDrinkImage(product)}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 135,
                      objectFit: "cover",
                      display: "block",
                      backgroundColor: "#F5F0EA",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500";
                    }}
                  />

                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      color="primary"
                      fontWeight="bold"
                      sx={{ mt: 0.5 }}
                    >
                      {formatCurrency(product.price)}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Chip
                        size="small"
                        label={
                          product.stock > 0
                            ? `Còn ${product.stock}`
                            : "Hết hàng"
                        }
                        color={
                          product.stock > 0 ? "success" : "error"
                        }
                        variant="outlined"
                      />

                      <AddIcon
                        fontSize="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {filteredProducts.length === 0 && (
              <Typography
                color="text.secondary"
                textAlign="center"
                sx={{ py: 5 }}
              >
                Không tìm thấy sản phẩm
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* GIỎ HÀNG */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #eee",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <ShoppingCartIcon color="primary" />

              <Typography variant="h6" fontWeight="bold">
                Giỏ hàng
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Chip
                label={`${cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )} món`}
                color="primary"
                size="small"
              />
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Divider />

            {/* Danh sách giỏ hàng */}
            <Box sx={{ minHeight: 200, py: 2 }}>
              {cart.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "text.secondary",
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      fontSize: 45,
                      color: "#BDBDBD",
                    }}
                  />

                  <Typography sx={{ mt: 1 }}>
                    Chưa có sản phẩm trong giỏ hàng
                  </Typography>
                </Box>
              ) : (
                cart.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={getDrinkImage(item)}
                        sx={{
                          width: 55,
                          height: 55,
                          borderRadius: 2,
                        }}
                      />

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography fontWeight="bold" noWrap>
                          {item.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {formatCurrency(item.price)}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography fontWeight="bold">
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ flexGrow: 1 }} />

                      <Typography
                        fontWeight="bold"
                        color="primary"
                      >
                        {formatCurrency(
                          item.price * item.quantity
                        )}
                      </Typography>
                    </Box>

                    <Divider sx={{ mt: 1.5 }} />
                  </Box>
                ))
              )}
            </Box>

            <Divider />

            {/* Tổng tiền */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <Typography fontWeight="bold">
                Tổng thanh toán
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
              >
                {formatCurrency(total)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              sx={{
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#795548",
                "&:hover": {
                  backgroundColor: "#4E342E",
                },
              }}
            >
              Thanh toán
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* HỘP CHỌN PHƯƠNG THỨC THANH TOÁN */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight="bold">
          Chọn phương thức thanh toán
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Tổng tiền: <strong>{formatCurrency(total)}</strong>
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<PaymentsIcon />}
            onClick={() => completeCheckout("Tiền mặt")}
            sx={{ py: 1.5, mb: 1.5 }}
          >
            Thanh toán tiền mặt
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<QrCode2Icon />}
            onClick={handleChooseQr}
            sx={{
              py: 1.5,
              backgroundColor: "#795548",
              "&:hover": {
                backgroundColor: "#4E342E",
              },
            }}
          >
            Chuyển khoản QR TPBank
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>
            Quay lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* HỘP HIỂN THỊ MÃ QR */}
      <Dialog
        open={openQrDialog}
        onClose={() => setOpenQrDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          fontWeight="bold"
          textAlign="center"
        >
          Thanh toán bằng QR TPBank
        </DialogTitle>

        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Số tiền cần thanh toán
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              {formatCurrency(total)}
            </Typography>

            {hasBankConfig ? (
              <Box
                component="img"
                src={qrUrl}
                alt="Mã QR thanh toán TPBank"
                sx={{
                  width: "100%",
                  maxWidth: 280,
                  display: "block",
                  mx: "auto",
                  border: "1px solid #eee",
                  borderRadius: 2,
                }}
              />
            ) : (
              <Alert
                severity="warning"
                sx={{ textAlign: "left", mb: 2 }}
              >
                Bạn chưa cấu hình tài khoản TPBank. Hãy mở đầu
                file POS.jsx và thay BANK_ACCOUNT,
                BANK_ACCOUNT_NAME bằng thông tin nhận tiền
                của cửa hàng.
              </Alert>
            )}

            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#F7F3EE",
                borderRadius: 2,
                textAlign: "left",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Ngân hàng
              </Typography>

              <Typography fontWeight="bold">
                TPBank
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Nội dung chuyển khoản
              </Typography>

              <Typography fontWeight="bold">
                {transferContent}
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{ mt: 2, textAlign: "left" }}
            >
              Sau khi kiểm tra tài khoản ngân hàng và xác nhận
              đã nhận đủ tiền, nhân viên mới nhấn nút xác nhận
              bên dưới. Bản demo này không tự động kiểm tra
              giao dịch.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            disabled={!hasBankConfig}
            onClick={() =>
              completeCheckout("Chuyển khoản QR TPBank")
            }
            sx={{
              py: 1.2,
              backgroundColor: "#795548",
              "&:hover": {
                backgroundColor: "#4E342E",
              },
            }}
          >
            Xác nhận đã nhận tiền
          </Button>

          <Button
            fullWidth
            onClick={() => setOpenQrDialog(false)}
          >
            Quay lại
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default POS;