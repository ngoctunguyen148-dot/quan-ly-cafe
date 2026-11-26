
export const initialProducts = [
  {
    id: 1,
    name: "Cà phê đen",
    category: "Cà phê",
    price: 25000,
    stock: 100,
    image: "☕",
  },
  {
    id: 2,
    name: "Cà phê sữa",
    category: "Cà phê",
    price: 30000,
    stock: 80,
    image: "🥤",
  },
  {
    id: 3,
    name: "Bạc xỉu",
    category: "Cà phê",
    price: 35000,
    stock: 60,
    image: "🧋",
  },
  {
    id: 4,
    name: "Trà đào",
    category: "Trà",
    price: 35000,
    stock: 50,
    image: "🍑",
  },
  {
    id: 5,
    name: "Trà sữa",
    category: "Trà",
    price: 40000,
    stock: 45,
    image: "🧋",
  },
  {
    id: 6,
    name: "Sinh tố dâu",
    category: "Sinh tố",
    price: 40000,
    stock: 30,
    image: "🍓",
  },
];

export const initialOrders = [
  {
    id: 1001,
    customer: "Nguyễn Văn An",
    total: 85000,
    status: "Hoàn thành",
    date: "2026-11-25",
  },
  {
    id: 1002,
    customer: "Trần Thị Bình",
    total: 65000,
    status: "Đang xử lý",
    date: "2026-11-26",
  },
  {
    id: 1003,
    customer: "Lê Minh Tuấn",
    total: 120000,
    status: "Hoàn thành",
    date: "2026-11-26",
  },
];
export const initialCategories = [
  { id: 1, name: "Cà phê", description: "Các loại cà phê" },
  { id: 2, name: "Trà", description: "Trà trái cây và trà sữa" },
  { id: 3, name: "Sinh tố", description: "Các loại sinh tố" },
  { id: 4, name: "Nước ép", description: "Nước ép trái cây" },
  { id: 5, name: "Khác", description: "Các loại đồ uống khác" },
];