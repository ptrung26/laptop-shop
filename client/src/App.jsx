import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./layouts";
import { Home } from "./pages/Home/Home";
import "./assets/styles/index.scss";
import Detail from "./pages/Detail/Detail";
import Signin from "./pages/Signin/Signin";
import Cart from "./pages/Cart/Cart";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Order from "./pages/Order/Order";
import Filter from "./pages/Filter/Filter";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Invoice from "./components/Invoice/Invoice";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products/:slug" element={<Detail />} />
          <Route path="filter" element={<Filter />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="cart" element={<Cart />} />
            <Route path="create-order" element={<Order />} />
          </Route>
        </Route>
        <Route path="invoice/:id" element={<Invoice />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
