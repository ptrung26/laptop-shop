import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ForgorPassword.scss";
import { UserServices } from "../../services/user.service";
export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      forgot_input_email: "",
    },
    validationSchema: Yup.object({
      forgot_input_email: Yup.string()
        .email("Email nhập không đúng định dạng")
        .required("Trường này chưa nhập"),
    }),
    onSubmit: async (values) => {
      const { forgot_input_email: email } = values;
      const { response, err } = await UserServices.forgotPassword(email);
      if (response) {
        alert("Check email hướng dẫn thay đổi mật khấu nhá!");
        formik.resetForm();
      }
    },
  });
  return (
    <div className="forgot-page">
      <h1>Quên mật khẩu</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            id="forgot_input_email"
            name="forgot_input_email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.forgot_input_email}
          />
        </div>
        {formik.errors.username ? (
          <div className="error-message">
            {formik.errors.forgot_input_email}
          </div>
        ) : null}

        <button type="submit" className="btn-submit-reset">
          Xác nhận
        </button>
      </form>
    </div>
  );
}
