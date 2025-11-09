import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import signupIllustration from "../../assets/signup-vector-img.png";

import {
  registerUser,
  sendEmailOtpApi,
  verifyEmailOtpApi,
  sendMobileOtpApi,
  verifyMobileOtpApi,
} from "../../services/apiHelpers";

// ✅ Form values type
interface SignUpFormValues {
  fullName: string;
  fatherName: string;
  motherName: string;
  email: string;
  emailOtp: string;
  mobile: string;
  mobileOtp: string;
  dob?: Date | null;
  gender: string;
  qualification: string;
  interest: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}


const SignUpForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    fatherName: Yup.string().required("Father’s Name is required"),
    motherName: Yup.string().required("Mother’s Name is required"),
    gender: Yup.string().required("Select gender"),
    dob: Yup.date().required("Select your date of birth"),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile number is required"),
    qualification: Yup.string().required("Qualification is required"),
    interest: Yup.string().required("Interest is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password"),
    termsAccepted: Yup.boolean().oneOf([true], "You must agree before signing up"),
  });

  // ✅ Formik Setup
  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      fullName: "",
      fatherName: "",
      motherName: "",
      email: "",
      emailOtp: "",
      mobile: "",
      mobileOtp: "",
      dob: null,
      gender: "",
      qualification: "",
      interest: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!emailVerified || !mobileVerified) {
        toast.warn("Please verify both Email and Mobile before signup");
        return;
      }
      try {
        setLoading(true);
        const payload = {
          fullName: values.fullName,
          fatherName: values.fatherName,
          motherName: values.motherName,
          email: values.email,
          mobile: values.mobile,
          emailOtp: values.emailOtp,
          mobileOtp: values.mobileOtp,
          gender: values.gender,
          dateOfBirth: values.dob
            ? new Date(values.dob).toISOString().split("T")[0]
            : "", // ✅ string (no null)
          qualification: values.qualification,
          interest: values.interest,
          password: values.password,
          confirmPassword: values.confirmPassword,
          termsAccepted: values.termsAccepted,
        };


        const res = await registerUser(payload);
        if (res?.status === 200) {
          toast.success("✅ Registration successful!");
          navigate("/home");
        } else {
          toast.error(res?.data?.message || "Registration failed");
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err?.response?.data?.message || "Signup error");
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ EMAIL OTP
  const handleSendEmailOtp = async () => {
    if (!formik.values.email) return toast.warn("Enter email first!");
    try {
      setLoading(true);
      const res = await sendEmailOtpApi({ email: formik.values.email });
      if (res?.status === 200) {
        setEmailOtpSent(true);
        toast.success("📧 Email OTP sent successfully!");
      }
    } catch {
      toast.error("Failed to send Email OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!formik.values.emailOtp) return toast.warn("Enter Email OTP");
    try {
      setLoading(true);
      const res = await verifyEmailOtpApi({
        email: formik.values.email,
        otp: formik.values.emailOtp,
      });
      if (res?.status === 200) {
        setEmailVerified(true);
        toast.success("✅ Email verified successfully!");
      } else toast.error("Invalid OTP");
    } catch {
      toast.error("Failed to verify Email OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ MOBILE OTP
  const handleSendMobileOtp = async () => {
    if (!formik.values.mobile) return toast.warn("Enter mobile number first!");
    try {
      setLoading(true);
      const res = await sendMobileOtpApi({ mobile: formik.values.mobile });
      if (res?.status === 200) {
        setMobileOtpSent(true);
        const match = res?.data?.match(/\d{4,6}/);
        if (match) {
          setGeneratedMobileOtp(match[0]);
          toast.success(`📱 Mobile OTP Sent (Testing: ${match[0]})`);
        } else toast.success("Mobile OTP Sent");
      }
    } catch {
      toast.error("Failed to send Mobile OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!formik.values.mobileOtp) return toast.warn("Enter Mobile OTP");
    try {
      setLoading(true);
      const res = await verifyMobileOtpApi({
        mobile: formik.values.mobile,
        otp: formik.values.mobileOtp,
      });
      if (res?.data?.message?.includes("verified")) {
        setMobileVerified(true);
        toast.success("✅ Mobile verified successfully!");
      } else toast.error(res?.data?.message || "Invalid Mobile OTP");
    } catch {
      toast.error("Failed to verify Mobile OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex w-[35%] items-center justify-center bg-gradient-to-br from-[#1b3a4b] via-[#28556b] to-[#3d738b]">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={signupIllustration}
            alt="Sign Up Illustration"
            className="w-72 h-auto object-contain"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-[65%] p-8 md:p-10 text-gray-800 overflow-y-auto h-[90vh]">
          <h1 className="text-center text-2xl font-bold text-[#001F5C] mb-6">Sign Up</h1>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <InputField icon={User} name="fullName" placeholder="Full Name" formik={formik} />
            <InputField icon={User} name="fatherName" placeholder="Father’s Name" formik={formik} />
            <InputField icon={User} name="motherName" placeholder="Mother’s Name" formik={formik} />

            {/* Gender + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium">Gender *</label>
                <div className="flex gap-6 mt-1">
                  {["Male", "Female"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formik.values.gender === g}
                        onChange={() => formik.setFieldValue("gender", g)}
                        className="accent-[#001F5C]"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <InputDate icon={Calendar} name="dob" placeholder="Date of Birth" formik={formik} />
            </div>

            <InputField name="qualification" placeholder="Qualification" formik={formik} />
            <InputField name="interest" placeholder="Area of Interest" formik={formik} />

            {/* ================= EMAIL + OTP ================= */}
            <div className="space-y-3 w-full">
              {/* EMAIL FIELD + SEND OTP BUTTON */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                  <InputField
                    icon={Mail}
                    name="email"
                    placeholder="Enter Email Address"
                    formik={formik}
                    disabled={emailVerified}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  className={`w-full sm:w-40 px-4 py-2 rounded-md text-white text-sm font-medium transition ${emailVerified
                    ? "bg-green-600 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {emailVerified ? "Verified" : emailOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              {/* OTP INPUT + VERIFY BUTTON */}
              {emailOtpSent && !emailVerified && (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Enter 6-digit Email OTP"
                    {...formik.getFieldProps("emailOtp")}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    className="w-full sm:w-40 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-medium transition"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            {/* ================= MOBILE + OTP ================= */}
            <div className="space-y-3 w-full mt-5">
              {/* MOBILE FIELD + SEND OTP BUTTON */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                  <InputField
                    icon={Phone}
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    formik={formik}
                    disabled={mobileVerified}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendMobileOtp}
                  className={`w-full sm:w-40 px-4 py-2 rounded-md text-white text-sm font-medium transition ${mobileVerified
                    ? "bg-green-600 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {mobileVerified ? "Verified" : mobileOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              {/* OTP INPUT + VERIFY BUTTON */}
              {mobileOtpSent && !mobileVerified && (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Enter 6-digit Mobile OTP"
                    {...formik.getFieldProps("mobileOtp")}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyMobileOtp}
                    className="w-full sm:w-40 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-medium transition"
                  >
                    Verify
                  </button>
                </div>
              )}

              {/* ✅ Show OTP for Testing */}
              {generatedMobileOtp && !mobileVerified && (
                <p className="text-xs text-gray-600 text-center">
                  Your OTP is{" "}
                  <span className="font-semibold text-green-700">{generatedMobileOtp}</span>.
                  Please enter this code and click <strong>Verify</strong> to confirm your
                  mobile number.
                </p>
              )}
            </div>


            {/* Passwords */}
            <PasswordField
              name="password"
              placeholder="Create Password"
              show={showPassword}
              setShow={setShowPassword}
              formik={formik}
            />
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm Password"
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              formik={formik}
            />

            {/* termsAccepted */}
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...formik.getFieldProps("termsAccepted")} className="accent-blue-600" />
              <span>
                I agree to the <b>Terms</b> & <b>Privacy Policy</b>.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#001F5C] text-white font-semibold rounded-md hover:bg-[#003399] transition"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

// ✅ Input Components
const InputField = ({ icon: Icon, name, placeholder, formik, disabled = false }: any) => (
  <div>
    <div className="flex items-center border rounded-md px-3 py-2 gap-2 border-gray-300">
      {Icon && <Icon className="text-gray-500" />}
      <input
        type="text"
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
        disabled={disabled}
        className="w-full outline-none text-gray-800 bg-transparent placeholder-gray-500"
      />
    </div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

const PasswordField = ({ name, placeholder, show, setShow, formik }: any) => (
  <div>
    <div className="flex items-center border rounded-md px-3 py-2 gap-2 border-gray-300">
      <Lock className="text-gray-500" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
        className="w-full outline-none text-gray-800 bg-transparent"
      />
      <button type="button" onClick={() => setShow(!show)} className="text-gray-500">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const InputDate = ({ icon: Icon, name, placeholder, formik }: any) => (
  <div>
    <div className="flex items-center border rounded-md px-3 py-2 gap-2 border-gray-300">
      {Icon && <Icon className="text-gray-500" />}
      <DatePicker
        selected={formik.values[name]}
        onChange={(date) => formik.setFieldValue(name, date)}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        className="w-full outline-none bg-transparent"
        maxDate={new Date()}
      />
    </div>
  </div>
);
