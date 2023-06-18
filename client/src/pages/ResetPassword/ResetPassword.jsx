import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ResetPassword.scss";
import { useParams, useNavigate } from "react-router-dom";
import { UserServices } from "../../services/user.service";
import { setUser } from "../../redux/slices/user.slice";

export default function ResetPassword() {
  let { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerifyToken = async () => {
      const { response, err } = await UserServices.verifyResetToken(token);
      if (err) {
        navigate("/");
      }
    };

    checkVerifyToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      reset_input_password: "",
      reset_input_confirmPassword: "",
    },
    validationSchema: Yup.object({
      reset_input_password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Trường này chưa nhập"),
      reset_input_confirmPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .oneOf([Yup.ref("reset_input_password")], "Mật khẩu không trùng nhau")
        .required("Trường này chưa nhập"),
    }),
    onSubmit: async (values) => {
      const { reset_input_password: password } = values;
      const { response, err } = await UserServices.resetPassword(
        token,
        password
      );
      if (response) {
        alert("Mật khẩu thay đổi thành công, vui lòng đăng nhập lại");
        setUser(null);
        localStorage.removeItem("actk");
        formik.resetForm();
        navigate("/signin");
      } else {
        alert("Xảy ra lỗi gì đó, vui lòng thử lại ");
      }
    },
  });
  return (
    <div className="reset-page">
      <h1>Đổi mật khẩu </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <input
            type="password"
            placeholder="password"
            id="reset_input_password"
            name="reset_input_password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reset_input_password}
          />
        </div>
        {formik.errors.username ? (
          <div className="error-message">
            {formik.errors.reset_input_password}
          </div>
        ) : null}
        <div className="input-group">
          <input
            type="password"
            placeholder="confirm password"
            id="reset_input_confirmPassword"
            name="reset_input_confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reset_input_confirmPassword}
          />
        </div>
        {formik.errors.username ? (
          <div className="error-message">
            {formik.errors.reset_input_confirmPassword}
          </div>
        ) : null}
        <button type="submit" className="btn-submit-reset">
          Xác nhận
        </button>
      </form>
    </div>
  );
}
