import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.jpg";
import searchIcon from "../../assets/images/search.png";
import cartIcon from "../../assets/images/shopping-cart.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import "./Header.scss";
import useDebounce from "../../hooks/useDebounce";
import { ProductServices } from "../../services/product.service";
import { setUser } from "../../redux/slices/user.slice";
import { UserServices } from "../../services/user.service";
export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState();
  const debouncedValue = useDebounce(searchValue, 500);
  const { user } = useSelector((state) => state.user);
  const { totalCart } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let location = useLocation();

  useEffect(() => {
    setSearchValue("");
    setSearchData(null);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedValue.trim() === "") {
        setSearchData(null);
        return;
      }
      const { response, err } = await ProductServices.filter({
        q: debouncedValue,
      });
      if (response) {
        setSearchData(response.data.products);
      }
    };

    fetchData();
  }, [debouncedValue]);

  const handleToLogout = async () => {
    const { response, err } = await UserServices.logout();
    if (response) {
      localStorage.removeItem("actk");
      dispatch(setUser(null));
      alert("Đăng xuất thành công!");
    }
  };

  return (
    <div className="header">
      <div className="header__top">
        <Link to="/" className="header__logo">
          <img src={logo} alt="logo" />
        </Link>
        <div className="header__search">
          <input
            type="text"
            className="header__search-input"
            placeholder="Bạn muốn tìm sản phẩm gì"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="header__search-btn">
            <img src={searchIcon} alt="search" />
          </button>
          {searchData && (
            <div className="header__search-results">
              {searchData.map((product, index) => {
                return (
                  <div className="search-product" key={index}>
                    <img
                      className="search-product__image"
                      src={product.image}
                      alt="product"
                    />
                    <div className="search-product__text">
                      <Link
                        to={`/products/${product.slug}`}
                        className="search-product__name"
                      >
                        {product.name}
                      </Link>
                      <p className="search-product__price">{`Giá: ${product.price}`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!user ? (
          <Link to={"/signin"} className="header__signin">
            Đăng nhập
          </Link>
        ) : (
          <div className="header__hello">
            <p className="">Xin chào: {user?.username}</p>
            <button onClick={() => handleToLogout()}>Đăng xuất ?</button>
          </div>
        )}
        <Link to={"/cart"} className="header__cart">
          {user && <span className="header__cart-total">{totalCart}</span>}
          <img src={cartIcon} alt="cart" />
        </Link>
      </div>
      <div className="header__nav"></div>
    </div>
  );
}
