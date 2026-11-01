import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { supabase } from "../supabase";

const ImageUpload = ({ 
  value, 
  onChange, 
  bucket = "project-images",
  label = "Image",
  maxSizeMB = 5 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // چک کردن حجم
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      if (e.target) e.target.value = "";
      return;
    }

    // چک کردن نوع فایل
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      if (e.target) e.target.value = "";
      return;
    }

    // نمایش پیش‌نمایش
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // آپلود به Supabase
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(data.publicUrl);
      setPreview(data.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [bucket, onChange, value, maxSizeMB]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800 dark:text-white">
        {label}
      </label>

      {error && (
        <div className="flex items-center gap-2 p-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-xs">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl">
        {preview ? (
          <div className="flex items-center gap-4 w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-lg object-cover border-2 border-indigo-500/30"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Image uploaded
              </p>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-all disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-6 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all border-2 border-dashed border-indigo-500/50 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Click to upload image</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Max size: {maxSizeMB}MB • PNG, JPG, WEBP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;