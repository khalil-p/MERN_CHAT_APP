import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AuthImagePattern from "../Components/AuthImagePattern";
import { Link } from "react-router-dom";
import { signUp } from "../store/slices/authSlice";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    avtar: "",
  });

  const dispatch = useDispatch();
  const { isSigninUp } = useSelector((state) => state.auth);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUp(formData));
  };

  const inputCss =
    "bg-white w-full border border-gray-300 rounded-md py-2 pl-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill]:text-black";

  return (
    <>
      <div className=" grid grod-cols-1 lg:grid-cols-2 bg-white">
        {/* {LEFT SIDE - FORM} */}
        <div className="flex flex-col justify-center items-center px-5 py-12">
          <div className="w-full max-w-md">
            {/* LOGO & HEADING */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="text-blue-600 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold mt-4">Create Account</h1>
              <p className="text-gray-500 text-sm mt-2">
                Get started with your free account
              </p>
            </div>
            {/* REGISTER - FORM */}
            <form
              action=""
              onSubmit={handleSubmit}
              className="spcae-y-6 flex gap-6 flex-col"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative bg-white">
                  <span className="absolute left-6 top-1/2 -translate-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="fulName"
                    className={inputCss}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative bg-white">
                  <span className="absolute left-6 top-1/2 -translate-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    className={inputCss}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={inputCss}
                    placeholder="*******"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                disabled={isSigninUp}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 flex justify-center items-center gap-2"
              >
                {isSigninUp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Already have an account?</p>
              <Link className="text-blue-600 hover:underline" to={"/login"}>
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <AuthImagePattern
          title={"Welcome!"}
          subtitle={
            "Register to start  converstion and catchup with youe fellows"
          }
        />
      </div>
    </>
  );
}
export default Register;
