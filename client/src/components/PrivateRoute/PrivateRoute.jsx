import React, { useLayoutEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
export default function PrivateRoute() {
  const token = localStorage.getItem("actk");
  return token ? <Outlet /> : <Navigate to="/signin" />;
}
