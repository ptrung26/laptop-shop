import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProductServices } from "../../services/product.service";
import Pagination from "../../components/Pagination/Pagination";
import Product from "../../components/Product/Product";

import "./Filter.scss";
const THUONG_HIEU = [
  { value: "ACER", status: false },
  { value: "ASUS", status: false },
  { value: "DELL", status: false },
  { value: "HP", status: false },
];
const CPU = [
  { key: "i5", value: "Intel core i5", status: false },
  { key: "i7", value: "Intel core i7", status: false },
  { key: "amd", value: "AMD Ryzen", status: false },
];

const RAM = [
  { value: "8GB", status: false },
  { value: "16GB", status: false },
];

const FILTER_PRICE = [
  {
    min: 5000000,
    max: 10000000,
    value: "5 triệu - 10 triệu",
    status: false,
  },
  {
    min: 10000000,
    max: 20000000,
    value: "10 triệu - 20 triệu",
    status: false,
  },
  {
    min: 20000000,
    max: 30000000,
    value: "20 triệu - 30 triệu",
    status: false,
  },
  {
    min: 30000000,
    max: 40000000,
    value: "30 triệu - 40 triệu",
    status: false,
  },
];

export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState();
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchParams) {
      navigate("/");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const queries = Object.fromEntries([...searchParams]);
      for (let [key, value] of Object.entries(queries)) {
        if (key === "order") {
          queries[key] = value.split(",");
        }
      }
      const { response, err } = await ProductServices.filter(queries);
      if (response) {
        setProducts(response.data.products);
        setTotalPage(response.data.totalPage);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleToAddQuery = (item, query) => {
    const params = Object.fromEntries([...searchParams]);
    if (!item?.status) {
      item.status = true;
      setSearchParams({ ...params, ...query });
    } else {
      item.status = false;
      Object.keys(query).forEach((key) => {
        delete params[key];
      });
      setSearchParams({ ...params });
    }
  };

  const onPageChange = (page) => {
    const params = Object.fromEntries([...searchParams]);
    setSearchParams({ ...params, page });
  };
  return (
    <div className="filter">
      <div className="container">
        <h2>Danh mục sản phẩm {searchParams.get("categoryId")}</h2>
        <div className="filter__section">
          <p>Lọc theo: </p>
          <div className="filter__list">
            <p className="filter__title">Thương hiệu</p>
            <ul>
              {THUONG_HIEU.map((item, index) => (
                <li
                  className={classNames({
                    active: searchParams.get("brand") === item.value,
                  })}
                  key={index}
                  onClick={() => handleToAddQuery(item, { brand: item.value })}
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="filter__list">
            <p className="filter__title">Giá</p>
            <ul>
              {FILTER_PRICE.map((item, index) => (
                <li
                  key={index}
                  className={classNames({
                    active:
                      searchParams.get("min") === item.min &&
                      searchParams.get("max") === item.max,
                  })}
                  onClick={() =>
                    handleToAddQuery(item, {
                      min: item.min,
                      max: item.max,
                    })
                  }
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="filter__list">
            <p className="filter__title">CPU</p>
            <ul>
              {CPU.map((item, index) => (
                <li
                  className={classNames({
                    active: searchParams.get("cpu") === item.value,
                  })}
                  key={index}
                  onClick={() =>
                    handleToAddQuery(item, {
                      cpu: item.key,
                    })
                  }
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="filter__list">
            <p className="filter__title">RAM</p>
            <ul>
              {RAM.map((item, index) => (
                <li
                  className={classNames({
                    active: searchParams.get("ram") === item.value,
                  })}
                  key={index}
                  onClick={() =>
                    handleToAddQuery(item, {
                      ram: item.value,
                    })
                  }
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="filter__result">
          {products &&
            products.map((product, index) => {
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
        {totalPage > 0 ? (
          <Pagination
            currentPage={+searchParams.get("page") || 1}
            maxDisplayPages={5}
            pageCount={totalPage}
            onPageChange={onPageChange}
          />
        ) : (
          <h2>Không có sản phẩm</h2>
        )}
      </div>
    </div>
  );
}
