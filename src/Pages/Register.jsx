import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { registerSchema } from "../schemas/registerSchema";
import toast from "react-hot-toast";

const Register = () => {
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const result = await signUp(data.email, data.password, data.full_name);

      if (result.user && !result.session) {
        toast.success("Registration successful! Please check your email.");
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        toast.success("Welcome! You're now logged in.");
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  // پیام موفقیت
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative z-30 max-w-md bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-lg text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Registration Successful!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Please check your email to confirm your account, then sign in.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Redirecting to login page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up — Eki Zulfar Rachman</title>
        <meta name="description" content="Create an account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 relative z-30 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
                <User className="w-8 h-8 text-indigo-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign up to get started
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-6 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    {...register("full_name")}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.full_name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("confirm_password")}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.confirm_password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 relative z-30 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center relative z-30 text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/admin/login"
                className="text-indigo-500 hover:text-indigo-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;