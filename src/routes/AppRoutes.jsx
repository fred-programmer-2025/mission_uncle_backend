import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import UncleList from "../pages/UncleList";
import OrderList from "../pages/OrderList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
      <Route path="/unclelist" element={<UncleList />} />
      <Route path="/orderlist" element={<OrderList />} />
    </Routes>
  );
};

export default AppRoutes;
