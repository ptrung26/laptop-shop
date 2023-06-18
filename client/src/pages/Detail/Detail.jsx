import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductServices } from "../../services/product.service";
import { useDispatch, useSelector } from "react-redux";
import Product from "../../components/Product/Product";

import "./Detail.scss";
import { addCart } from "../../redux/slices/user.slice";
import formatMoney from "../../utils/formatMoney";
const dataRaw = `
<p>
</p>
`;
export default function Detail() {
  let { slug } = useParams();
  const [product, setProduct] = useState();
  const [relatedProduct, setRelatedProduct] = useState();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        return;
      }

      let { response, err } = await ProductServices.getProductBySlug(slug);
      if (response) {
        setProduct(response.data.product);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      if (!product) {
        return;
      }

      const categorySlug = product.categoryData.slug;
      const { response, err } = await ProductServices.filter({
        category: categorySlug,
      });
      if (response) {
        const products = response.data.products.filter(
          (x) => x.id !== product.id
        );
        setRelatedProduct(products);
      } else {
      }
    };

    fetchData();
  }, [product]);

  const handleToAddToCart = async () => {
    if (!user) {
      alert("Bạn phải đăng nhập mới thêm được sản phẩm vào giỏ hàng");
      return;
    }
    dispatch(
      addCart({
        productId: product.id,
        quantity: 1,
      })
    );
  };

  return (
    <div className="detail-page">
      <div className="container">
        {product && (
          <>
            <div className="product-detail">
              <div className="product-detail__images">
                <img
                  src={product.image}
                  alt="product"
                  className="product-detail__images-show"
                />
                <div className="product-detail__thumbs">
                  {product.images &&
                    product.images.map((image, index) => {
                      return (
                        <img key={index} src={image.imageSrc} alt="product" />
                      );
                    })}
                </div>
              </div>
              <div className="product-detail__main">
                <h2 className="product-detail__name">{product.name}</h2>
                <p className="product-detail__price">
                  <span className="product-detail__price-new">
                    {formatMoney(
                      parseInt(
                        product.price * (1 - (1.0 * product.discount) / 100)
                      )
                    )}
                  </span>
                  <span className="product-detail__price-old">
                    {formatMoney(product.price)}
                  </span>
                </p>
                <p style={{ marginTop: 10 }}>
                  <b>Bảo hành:</b> <span> 12 tháng</span>
                </p>
                <p
                  className="product-detail__quantity"
                  style={{ marginTop: 10 }}
                >
                  <b>Tình trạng: </b>
                  {+product.quantity > 0 ? (
                    <span> Còn hàng</span>
                  ) : (
                    <span> Hết hàng</span>
                  )}
                </p>
                <div className="product-detail__gift">
                  <h4>QUÀ TẶNG/KHUYẾN MÃI</h4>
                  <ul>
                    <li>✅ Tặng Windows 11 bản quyền theo máy</li>
                    <li>✅ Miễn phí cân màu màn hình công nghệ cao</li>
                    <li>✅ Balo thời trang</li>
                    <li>✅ Chuột không dây + Bàn di cao cấp</li>
                  </ul>
                </div>
                <button
                  className="add-to-cart"
                  onClick={() => handleToAddToCart()}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
            <div className="product-desc">
              <h4 className="product-desc__title">Mô tả sản phẩm</h4>
              <div dangerouslySetInnerHTML={{ __html: dataRaw }}></div>
              <div className="product-specification">
                <p>
                  <span>Tên sản phẩm</span> <span>{product.name}</span>
                </p>
                <p>
                  <span>Cpu</span>
                  <span> {product.cpu}</span>
                </p>
                <p>
                  <span>Ram</span> <span>{product.ram}</span>
                </p>
                <p>
                  <span>Ổ cứng</span>
                  <span> {product.hardDrive}</span>
                </p>
                <p>
                  <span>Card đồ họa</span> <span>{product.vga}</span>
                </p>
                <p>
                  <span>Màn hình</span>
                  <span> {product.monitor}</span>
                </p>
              </div>
            </div>
            <div className="product-related">
              <h2>Sản phẩm liên quan</h2>
              <div className="product-related__list">
                {relatedProduct &&
                  relatedProduct.map((product, index) => {
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
