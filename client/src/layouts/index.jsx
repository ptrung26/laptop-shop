import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import { UserServices } from "../services/user.service";
import { fetchCart, setUser } from "../redux/slices/user.slice";

export default function Layout() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("actk")) {
        return;
      }
      const { response, err } = await UserServices.getInfo();
      if (response) {
        dispatch(setUser(response.data.user));
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
