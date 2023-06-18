import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUser } from "../../redux/slices/user.slice";
import usernameIcon from "../../assets/images/username.png";
import passwordIcon from "../../assets/images/password.png";
import "./Signup.scss";
import { UserServices } from "../../services/user.service";
export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Trường này chưa nhập"),
      username: Yup.string()
        .min(6, "Tải khoản phải ít nhất 6 ký tự")
        .required("Trường này chưa nhập"),
      password: Yup.string()
        .min(6, "Mật khẩu phải ít nhất 6 ký tự")
        .required("Trường này chưa nhập"),
    }),
    onSubmit: async (values) => {
      const { username, password, email } = values;

      try {
        const { response, err } = await UserServices.signup({
          username,
          password,
          email,
        });

        if (response) {
          localStorage.setItem("actk", response.data.accessToken);
          formik.resetForm();

          const { response: infoResponse, err: infoError } =
            await UserServices.getInfo();

          if (infoResponse) {
            dispatch(setUser(infoResponse.data.user));
            alert("Đăng ký thành công");
            navigate("/");
          } else {
            throw new Error(infoError.response.data.message);
          }
        } else {
          throw new Error(err.response.data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });
  return (
    <div className="signup-page">
      <h1>Đăng ký</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <div className="input-icon">
            <img src={usernameIcon} alt="email" />
          </div>
          <input
            type="email"
            placeholder="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </div>
        {formik.errors.username ? (
          <div className="error-message">{formik.errors.email}</div>
        ) : null}
        <div className="input-group">
          <div className="input-icon">
            <img src={usernameIcon} alt="username" />
          </div>
          <input
            type="text"
            placeholder="username"
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
        </div>
        {formik.errors.username ? (
          <div className="error-message">{formik.errors.username}</div>
        ) : null}
        <div className="input-group">
          <div className="input-icon">
            <img src={passwordIcon} alt="password" />
          </div>
          <input
            type="password"
            placeholder="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
        </div>
        {formik.errors.password ? (
          <div className="error-message">{formik.errors.password}</div>
        ) : null}
        <p className="navigate-signup">
          Bạn đã có tài khoản ?<Link to="/signin"> Đăng nhập ngay</Link>
        </p>
        <button type="submit" className="btn-signup">
          Đăng ký
        </button>
      </form>
    </div>
  );
}
