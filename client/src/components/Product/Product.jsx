import React from "react";
import { Link } from "react-router-dom";
import formatMoney from "../../utils/formatMoney";
import "./Product.scss";
export default function Product({ name, slug, priceOld, priceNew, image }) {
  return (
    <div className="product">
      <img src={image} alt="product" className="product__image" />
      <Link to={`/products/${slug}`} className="product__name">
        {name.slice(0, 50)}...
      </Link>
      <p className="product__price">
        <span className="product__price-new">{formatMoney(priceNew)}</span>
        <span className="product__price-old">{formatMoney(priceOld)}</span>
      </p>
    </div>
  );
}
