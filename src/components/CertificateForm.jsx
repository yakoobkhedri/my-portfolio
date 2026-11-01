import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { certificateSchema } from "../schemas/certificateSchema";

const CertificateForm = ({ certificate, onSubmit, onCancel, isSubmitting }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(certificateSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            issuer: "",
            date: "",
            image_url: "",
        },
    });

    useEffect(() => {
        if (certificate) {
            reset({
                title: certificate.title || "",
                issuer: certificate.issuer || "",
                date: certificate.date || "",
                image_url: certificate.image_url || "",
            });
        } else {
            reset();
        }
    }, [certificate, reset]);

    const onFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Certificate title"
                    {...register("title")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.title && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Issuer */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Issuer <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g., Coursera, Udemy"
                    {...register("issuer")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.issuer
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.issuer && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.issuer.message}
                    </p>
                )}
            </div>

            {/* Date */}
            <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-800 dark:text-white">
                    Date <span className="text-red-500">*</span>
                </label>
                <input id="date"
                    type="date"
                    {...register("date")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.date
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.date && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.date.message}
                    </p>
                )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Image URL
                </label>
                <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    {...register("image_url")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.image_url
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.image_url && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.image_url.message}
                    </p>
                )}
            </div>

            {/* Image Preview */}
            {watch("image_url") && (
                <div className="mt-3">
                    <img
                        src={watch("image_url")}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-xl border border-gray-200 dark:border-white/10"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                        onLoad={(e) => {
                            e.target.style.display = "block";
                        }}
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>{certificate ? "Update Certificate" : "Add Certificate"}</>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 h-12 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CertificateForm;