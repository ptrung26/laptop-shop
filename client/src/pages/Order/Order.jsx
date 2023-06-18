import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Order.scss";
import formatMoney from "../../utils/formatMoney";
import { Link } from "react-router-dom";
import { OrderServices } from "../../services/order.service";

export default function Order() {
  const { cart } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  let totalPrice = useMemo(() => {
    if (!cart) {
      return 0;
    }

    let total = 0;
    cart.map((item) => {
      total += item.price * item.quantity;
    });

    return total;
  }, [cart]);

  const formik = useFormik({
    initialValues: {
      order_fullname: "",

      order_address: "",
      order_phoneNumber: "",
    },
    validationSchema: Yup.object({
      order_fullname: Yup.string().required("Bạn phải nhập tên"),
      order_address: Yup.string().required("Bạn phải nhập địa chỉ"),
      order_phoneNumber: Yup.string().required("Bạn phải nhập số điện thoại "),
    }),
    onSubmit: async (values) => {
      const order = {
        fullName: values.order_fullname,
        email: user?.email,
        phoneNumber: values.order_phoneNumber,
        address: values.order_address,
      };
      const { response, err } = await OrderServices.addNewOrder({
        order,
        cart,
      });
      if (response) {
        alert("Đặt hàng thành công, check email nha!");
      } else {
        alert("Đặt hàng thất bại, có lỗi gì đó !");
      }
      formik.resetForm();
      navigate("/");
    },
  });

  return (
    <div className="order">
      <div className="container order__wrapper">
        <div className="order__info">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                id="order_fullname"
                placeholder="Họ và tên"
                name="order_fullname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.order_fullname}
              />
            </div>
            {formik.errors.order_fullname ? (
              <div className="error-message">
                {formik.errors.order_fullname}
              </div>
            ) : null}
            <div className="input-group">
              <input
                type="text"
                id="order_email"
                name="order_email"
                placeholder="Email"
                value={user?.email}
                disabled
              />
            </div>
            {formik.errors.order_email ? (
              <div className="error-message">{formik.errors.order_email}</div>
            ) : null}
            <div className="input-group">
              <input
                type="text"
                placeholder="Số điện thoại"
                id="order_phoneNumber"
                name="order_phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.order_phoneNumber}
              />
            </div>
            {formik.errors.order_phoneNumber ? (
              <div className="error-message">
                {formik.errors.order_phoneNumber}
              </div>
            ) : null}

            <div className="input-group">
              <input
                type="text"
                placeholder="Địa chỉ"
                id="order_address"
                name="order_address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.order_address}
              />
            </div>
            {formik.errors.order_address ? (
              <div className="error-message">{formik.errors.order_address}</div>
            ) : null}

            <button type="submit" className="order__submit">
              Hoàn tất đơn hàng
            </button>
          </form>
        </div>
        <div className="order__product">
          <div className="order__product-list">
            {cart &&
              cart.map((product, index) => {
                return (
                  <div className="order__product-item" key={index}>
                    <span className="order__product-quantity">
                      {product.quantity}
                    </span>

                    <img
                      src={product.image}
                      alt="product"
                      className="order__product-image"
                    />
                    <Link to={product.id} className="order__product-name">
                      {product.name.slice(0, 50)}...
                    </Link>
                    <p className="order__product-price">
                      {formatMoney(product.price)}
                    </p>
                  </div>
                );
              })}

            <p className="order__product-total">
              Tổng tiền: {formatMoney(totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
