
import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import {
  initialProducts,
  initialOrders,
  initialCategories,
} from "../data/initialData";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Quản lý sản phẩm
  const [products, setProducts] = useLocalStorage(
    "coffee_products",
    initialProducts
  );

  // Quản lý đơn hàng
  const [orders, setOrders] = useLocalStorage(
    "coffee_orders",
    initialOrders
  );

  // Quản lý danh mục
  const [categories, setCategories] = useLocalStorage(
    "coffee_categories",
    initialCategories
  );

  // Thêm sản phẩm
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  // Sửa sản phẩm
  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  // Xóa sản phẩm
  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  // Thêm đơn hàng
  const addOrder = (order) => {
    setOrders((prev) => [
      { ...order, id: Date.now() },
      ...prev,
    ]);
  };

  // Thêm danh mục
  const addCategory = (category) => {
    setCategories((prev) => [
      ...prev,
      { ...category, id: Date.now() },
    ]);
  };

  // Sửa danh mục
  const updateCategory = (id, updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, ...updatedCategory }
          : category
      )
    );
  };

  // Xóa danh mục
  const deleteCategory = (id) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );
  };

  // Quản lý khách hàng
  const [customers, setCustomers] = useLocalStorage(
    "coffee_customers",
    [
      {
        id: 1,
        name: "Nguyễn Văn An",
        phone: "0905123456",
        email: "an@gmail.com",
        address: "Đà Nẵng",
      },
      {
        id: 2,
        name: "Trần Thị Bình",
        phone: "0912345678",
        email: "binh@gmail.com",
        address: "Đà Nẵng",
      },
      {
        id: 3,
        name: "Lê Minh Tuấn",
        phone: "0987654321",
        email: "tuan@gmail.com",
        address: "Quảng Nam",
      },
    ]
  );

  // Thêm khách hàng
  const addCustomer = (customer) => {
    setCustomers((prev) => [
      ...prev,
      { ...customer, id: Date.now() },
    ]);
  };

  // Sửa khách hàng
  const updateCustomer = (id, updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? { ...customer, ...updatedCustomer }
          : customer
      )
    );
  };

  // Xóa khách hàng
  const deleteCustomer = (id) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== id)
    );
  };

  // Quản lý nhân viên
  const [employees, setEmployees] = useLocalStorage(
    "coffee_employees",
    [
      {
        id: 1,
        name: "Nguyễn Văn Nam",
        phone: "0905111222",
        email: "nam@gmail.com",
        position: "Quản lý",
        salary: 10000000,
        status: "Đang làm",
      },
      {
        id: 2,
        name: "Trần Thị Lan",
        phone: "0905333444",
        email: "lan@gmail.com",
        position: "Thu ngân",
        salary: 7000000,
        status: "Đang làm",
      },
      {
        id: 3,
        name: "Lê Minh Tuấn",
        phone: "0905555666",
        email: "tuan@gmail.com",
        position: "Nhân viên",
        salary: 6000000,
        status: "Đang làm",
      },
    ]
  );

  // Thêm nhân viên
  const addEmployee = (employee) => {
    setEmployees((prev) => [
      ...prev,
      { ...employee, id: Date.now() },
    ]);
  };

  // Sửa nhân viên
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? { ...employee, ...updatedEmployee }
          : employee
      )
    );
  };

  // Xóa nhân viên
  const deleteEmployee = (id) => {
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== id)
    );
  };

  // Cài đặt cửa hàng
  const [settings, setSettings] = useLocalStorage(
    "coffee_settings",
    {
      shopName: "Coffee House",
      address: "Đà Nẵng, Việt Nam",
      phone: "0905123456",
      email: "coffee@gmail.com",
      lowStockLimit: 10,
    }
  );

  return (
    <AppContext.Provider
      value={{
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

        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        addCategory,
        updateCategory,
        deleteCategory,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
