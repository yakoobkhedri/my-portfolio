import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Settings, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  User,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  FileText,
  Clock
} from "lucide-react";
import { useSiteSettings, useUpdateSiteSettings } from "../../hooks/useSiteSettings";
import { siteSettingsSchema } from "../../schemas/siteSettingsSchema";
import { useState } from "react";
import { successAlert, errorAlert } from "../../utils/alerts";

const AdminSettings = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(siteSettingsSchema),
    mode: "onTouched",
  });

  // پر کردن فرم وقتی تنظیمات لود شد
  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    try {
      await updateSettings.mutateAsync(data);
      successAlert("Settings Saved!", "Your changes have been saved successfully.");
      setIsSuccess(true);
      reset(data); // فرم رو با مقادیر جدید reset کن (isDirty = false)
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      errorAlert("Error", "Failed to save settings. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Error Loading Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings — Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-14 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-8 h-8 text-indigo-500" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Settings
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your site's personal information and social links.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 mb-6 text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Settings saved successfully!</p>
          </motion.div>
        )}

        {/* Error */}
        {updateSettings.error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Failed to save settings. Please try again.</p>
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 relative z-30"
        >
          {/* Personal Info */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  {...register("site_name")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.site_name ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.site_name && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.site_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Site Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your job title"
                  {...register("site_title")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.site_title ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.site_title && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.site_title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description about you"
                  {...register("site_description")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                    errors.site_description ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.site_description && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.site_description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.email ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Your location"
                  {...register("location")}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-indigo-500 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Availability
                </label>
                <input
                  type="text"
                  placeholder="e.g., Available for freelance"
                  {...register("availability")}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-indigo-500 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Github className="w-5 h-5 text-indigo-500" />
              Social Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub URL
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/yourusername"
                  {...register("github_url")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.github_url ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.github_url && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.github_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/yourusername"
                  {...register("linkedin_url")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.linkedin_url ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.linkedin_url && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.linkedin_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/yourusername"
                  {...register("instagram_url")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.instagram_url ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.instagram_url && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.instagram_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  CV URL
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  {...register("cv_url")}
                  className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.cv_url ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                  }`}
                />
                {errors.cv_url && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cv_url.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateSettings.isPending || !isDirty}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default AdminSettings;