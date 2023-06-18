import React, { useEffect, useState } from "react";
import Product from "../Product/Product";
import { Link } from "react-router-dom";
import "./Category.scss";
import { ProductServices } from "../../services/product.service";
import queryString from "query-string";

export default function Category({ title, query }) {
  const [products, setProducts] = useState();
  useEffect(() => {
    const fetchData = async () => {
      if (query?.order && typeof query.order === "string") {
        let value = query.order.split();
        query.order = value;
      }
      const { response, err } = await ProductServices.filter({ ...query });
      if (response) {
        setProducts(response.data.products);
      } else {
      }
    };

    fetchData();
  }, [title, query]);
  return (
    <section className="category-product">
      <div className="category-product__header">
        <p className="category-product__title">
          <span>{title}</span>
        </p>
        <Link to={`/filter?${queryString.stringify(query)}`}>Xem tất cả</Link>
      </div>
      <div className="category-product__list">
        {products &&
          products.slice(0, 4).map((product, index) => {
            return (
              <Product
                key={index}
                slug={product.slug}
                name={product.name}
                priceNew={parseInt(
                  product.price * (1 - (1.0 * product.discount) / 100)
                )}
                priceOld={product.price}
                image={product.image}
              />
            );
          })}
      </div>
    </section>
  );
}
