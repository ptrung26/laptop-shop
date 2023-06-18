import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./Invoice.scss";
import { useParams } from "react-router";
import { OrderServices } from "../../services/order.service";
import formatMoney from "../../utils/formatMoney";
import { Link } from "react-router-dom";
const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      const { response, err } = await OrderServices.getOrderById({ id });
      if (response) {
        setOrder(response.data.order);
      } else {
        alert("Something wrong!, Try again");
      }
    };

    fetchData();
  }, [id]);

  const invoiceRef = useRef();
  const handlePrint = () => {
    if (!invoiceRef) {
      return;
    }

    const invoiceElement = invoiceRef.current;
    // Tạo ảnh screenshot từ phần tử invoice
    html2canvas(invoiceElement, { logging: true, useCORS: true }).then(
      (canvas) => {
        const imgWith = 208;
        const imgHeight = (canvas.height * imgWith) / canvas.width;
        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imageData, "PNG", 0, 0, imgWith, imgHeight);
        pdf.save("hoadon.pdf");
      }
    );
  };

  if (!order) return <></>;
  return (
    <div className="container">
      <div className=" invoice" ref={invoiceRef}>
        <div className="invoice__header">
          <h3>Công ty cổ phân XYZ</h3>
          <p>Điện thoại : 033x-456-789</p>
          <p>Email: aa@gmail.com</p>
        </div>
        <div className="invoice__info">
          <p>
            <b>Họ tên</b>: {order.fullName}
          </p>
          <p>
            <b>Địa chỉ</b>: {order.address}
          </p>
          <p>
            <b>SĐT</b>: 033x-111-222
          </p>
          <p>
            <b>Email</b>: {order.email}
          </p>
        </div>
        <h2 className="invoice__heading">Đơn đặt hàng</h2>
        <div className="invoice__table">
          <div className="invoice__table-header">
            <p className="invoice__index">STT</p>
            <p className="invoice__item">Sản phẩm</p>
            <p className="invoice__quantity">Số lượng</p>
            <p className="invoice__price">Đơn giá</p>
            <p className="invoice__totalPrice">Thành tiền</p>
          </div>
          {order.orderDetails &&
            order.orderDetails.map((order, index) => {
              const product = order.productData;
              return (
                <div className="invoice__table-body" key={index}>
                  <p className="invoice__index">{index + 1}</p>
                  <p className="invoice__item ">
                    <Link to={`products/${product.slug}`}>{product.name}</Link>
                  </p>
                  <p className="invoice__quantity">{+order.quantity}</p>
                  <p className="invoice__price">{formatMoney(+order.price)}</p>
                  <p className="invoice__totalPrice">
                    {formatMoney(+order.price * +order.quantity)}
                  </p>
                </div>
              );
            })}
        </div>
        <p className="invoice__total">
          Tổng tiền : {formatMoney(+order.totalPrice)}
        </p>
      </div>
      <button className="export-invoice" onClick={() => handlePrint()}>
        Xuất hóa đơn
      </button>
    </div>
  );
};

export default Invoice;
