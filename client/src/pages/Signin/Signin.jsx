import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUser } from "../../redux/slices/user.slice";
import usernameIcon from "../../assets/images/username.png";
import passwordIcon from "../../assets/images/password.png";
import "./Signin.scss";
import { UserServices } from "../../services/user.service";
export default function Signin() {
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
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, "sername must be at least 6 characters")
        .required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        const { response, err } = await UserServices.signin({
          username,
          password,
        });

        if (response) {
          localStorage.setItem("actk", response.data.accessToken);
          formik.resetForm();
          const { response: infoResponse, err: infoError } =
            await UserServices.getInfo();

          if (infoResponse) {
            dispatch(setUser(infoResponse.data.user));
            alert("Đăng nhập thành công");
            navigate("/");
          } else {
            console.log(infoError);
            throw new Error(infoError.response.data.message);
          }
        } else {
          console.log(err);
          throw new Error(err.response.data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });
  return (
    <div className="signin-page">
      <h1>Đăng nhập</h1>
      <form onSubmit={formik.handleSubmit}>
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
            <img src={passwordIcon} alt="username" />
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
        <Link to={"/forgot-password"} className="navigate-forgot-password">
          Quên mật khẩu ?
        </Link>
        <p className="navigate-signup">
          Bạn chưa có tài khoản ?<Link to="/signup"> Đăng ký ngay</Link>
        </p>
        <button type="submit" className="btn-signin">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
