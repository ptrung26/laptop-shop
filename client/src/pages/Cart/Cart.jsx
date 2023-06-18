import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCart,
  removeCartItem,
  fetchCart,
} from "../../redux/slices/user.slice";
import formatMoney from "../../utils/formatMoney";
import trashIcon from "../../assets/images/trash.png";
import { Link } from "react-router-dom";

import "./Cart.scss";
export default function Cart() {
  const { cart } = useSelector((state) => state.user);
  const { totalCart } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart) {
      dispatch(fetchCart());
    }
  }, [cart, dispatch]);

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

  const handleToUpdateCartItem = ({ productId, quantity }) => {
    if (quantity.trim() === "") {
      return;
    }
    dispatch(updateCart({ productId, quantity: parseInt(quantity) }));
  };

  return (
    <div className="cart">
      <div className="container">
        <h1>Giỏ hàng</h1>
        <div className="cart__header">
          <span className="cart__image">Sản phẩm</span>
          <span className="cart__name">Tên sản phẩm</span>
          <span className="cart__quantity">Số lượng</span>
          <span className="cart__price">Giá tiền</span>
          <div className="cart__remove">Xóa</div>
        </div>
        {cart && (
          <>
            <div className="cart__list">
              {cart.map((product, index) => {
                return (
                  <div className="product-cart" key={index}>
                    <img
                      src={product.image}
                      alt="product"
                      className="product-cart__image"
                    />
                    <Link
                      to={`/products/${product.slug}`}
                      className="product-cart__name"
                    >
                      {product.name}
                    </Link>
                    <div className="product-cart__quantity">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleToUpdateCartItem({
                            productId: product.id,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>
                    <p className="product-cart__price">
                      {formatMoney(product.price)}
                    </p>
                    <button
                      className="product-cart__remove"
                      onClick={() => dispatch(removeCartItem(product.id))}
                    >
                      <img src={trashIcon} alt={"remove cart"} />
                    </button>
                  </div>
                );
              })}
            </div>
            {+totalCart > 0 ? (
              <>
                <p className="cart__total-price">
                  Tổng tiền: {formatMoney(totalPrice)}
                </p>
                <Link to={"/create-order"} className="cart__btn">
                  Thanh toán
                </Link>
              </>
            ) : (
              <h2
                style={{
                  marginTop: 25,
                  fontSize: 18,
                  color: "red",
                }}
              >
                Chưa có sản phẩm nào trong giỏ hàng
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
}
