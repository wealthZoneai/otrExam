import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Illustration from "../../assets/login-vector-img.png";
import { loginUser } from "../../services/apiHelpers";
import { setUserData } from "../../store/slice/userData";

// ----------------------
// ✅ Type Definitions
// ----------------------
interface LoginFormValues {
  email: string;
  password: string;
  role: string;
}

// ----------------------
// ✅ Component
// ----------------------
const UserLoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ----------------------
  // ✅ Validation Schema
  // ----------------------
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ----------------------
  // ✅ Formik Setup
  // ----------------------
  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "", role: "Admin" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await loginUser({
          email: values.email,
          password: values.password,
        });
        
        if (response?.data?.jwt) {
          localStorage.setItem("token", response.data.jwt);
          localStorage.setItem("candidateId", response.data.candidateId);

          dispatch(
            setUserData({
              jwt: response.data.jwt,
              userId: response.data.userId,
              userName: response.data.userName,
              candidateId: response.data.candidateId,
            })
          );
          toast.success("Login successful!");
          navigate("/examScreen");
        } else {
          toast.error("Login failed. Token not received.");
        }
      } catch (error) {
        toast.error(
            "Login failed. Please check your credentials."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ----------------------
  // ✅ JSX
  // ----------------------
  return (
    <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT SECTION */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-8">
          <motion.img
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            src={Illustration}
            alt="Login Illustration"
            className="w-80 h-auto object-contain"
          />
        </div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center p-10 md:p-14"
        >
          {/* Header */}
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
            Sign in to your account
          </h2>

          {/* FORM */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-md px-3 py-2">
                <HiOutlineMail className="text-gray-500 text-lg" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full outline-none bg-transparent text-gray-800"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-md px-3 py-2">
                <HiOutlineLockClosed className="text-gray-500 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full outline-none bg-transparent text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="text-gray-500" />
                  ) : (
                    <HiOutlineEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#0072ff] text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 rounded-md font-semibold bg-[#001F5C] text-white hover:bg-[#003399] transition"
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* Signup link */}
            {/* <p className="text-center text-gray-600 text-sm mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#0072ff] cursor-pointer hover:underline"
              >
                Create an account
              </span>
            </p> */}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLoginForm;
