import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { projectSchema } from "../schemas/projectSchema";

const ProjectForm = ({ project, onSubmit, onCancel, isSubmitting }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            description: "",
            image_url: "",
            live_url: "",
            github_url: "",
            category: "",
            technologies: "",
            features: "",
        },
    });

    // پر کردن فرم در حالت ویرایش
    useEffect(() => {
        if (project) {
            reset({
                title: project.title || "",
                description: project.description || "",
                image_url: project.image_url || "",
                live_url: project.live_url || "",
                github_url: project.github_url || "",
                category: project.category || "",
                technologies: Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : "",
                features: Array.isArray(project.features)
                    ? project.features.join(", ")
                    : "",
            });
        } else {
            reset();
        }
    }, [project, reset]);

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
                    placeholder="Project title"
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

            {/* Description */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="Project description"
                    rows={4}
                    {...register("description")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${errors.description
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description.message}
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

            {/* Live URL & GitHub URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                        Live Demo URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://demo.com"
                        {...register("live_url")}
                        className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.live_url
                            ? "border-red-500"
                            : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                            }`}
                    />
                    {errors.live_url && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.live_url.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">
                        GitHub URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://github.com/..."
                        {...register("github_url")}
                        className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.github_url
                            ? "border-red-500"
                            : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                            }`}
                    />
                    {errors.github_url && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.github_url.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Category <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g., React, JavaScript, Web"
                    {...register("category")}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-white/10 focus:border-indigo-500"
                        }`}
                />
                {errors.category && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category.message}
                    </p>
                )}
            </div>

            {/* Technologies */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Technologies (comma-separated)
                </label>
                <input
                    type="text"
                    placeholder="React, Tailwind, Supabase"
                    {...register("technologies")}
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-indigo-500 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>

            {/* Features */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Key Features (comma-separated)
                </label>
                <input
                    type="text"
                    placeholder="Dark Mode, Responsive, User Auth"
                    {...register("features")}
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-indigo-500 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>

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
                        <>{project ? "Update Project" : "Add Project"}</>
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

export default ProjectForm;