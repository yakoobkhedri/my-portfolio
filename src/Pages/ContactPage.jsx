import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, Loader2, AlertCircle, CheckCircle2, Mail, MessageSquare, User, Tag } from "lucide-react";
import { useState } from "react";
import { messageSchema } from "../schemas/messageSchema";
import { useAddMessage } from "../hooks/useMessages";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const addMessage = useAddMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(messageSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
  try {
    await addMessage.mutateAsync({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    
    toast.success("Message sent successfully! I'll get back to you soon.");
    reset();
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message. Please try again.");
  }
};

  return (
    <>
      <Helmet>
        <title>Contact — yakoob khedri</title>
        <meta name="description" content="Get in touch with Eki Zulfar Rachman." />
      </Helmet>

      <div id="Contact" className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or want to work together? Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-gray-200 dark:border-white/10 shadow-lg">
            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 mb-6 text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Message sent successfully! I'll get back to you soon.</p>
              </motion.div>
            )}

            {/* Error Message */}
            {addMessage.error && (
              <div className="flex items-center gap-2 p-4 mb-6 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Failed to send message. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Your name"
                    {...register('name')}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
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
                    {...register('email')}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
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

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="What's this about?"
                    {...register('subject')}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.subject && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    {...register('message')}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.message && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative z-20 h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ContactPage;