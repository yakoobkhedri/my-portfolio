import { useState, useRef, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MessageCircle,
  UserCircle2,
  Loader2,
  AlertCircle,
  Send,
  ImagePlus,
  X
} from 'lucide-react';
import { z } from 'zod';
import { supabase } from '../supabase';
import {
  useProjectComments,
  useAddProjectComment
} from '../hooks/useProjectComments';
import toast from "react-hot-toast";

// Schema
const commentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(15, 'Name must be less than 15 characters'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .min(5, 'Message must be at least 5 characters')
    .max(200, 'Message must be less than 200 characters'),
});

// Comment Item
const Comment = memo(({ comment, formatDate }) => (
  <div className="px-4 pt-4 pb-2 rounded-xl border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all group">
    <div className="flex items-start gap-3">
      {comment.profile_image ? (
        <img
          src={comment.profile_image}
          alt={`${comment.user_name}'s profile`}
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30 flex-shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="p-2 rounded-full text-indigo-500 dark:text-indigo-400 bg-indigo-500/20">
          <UserCircle2 className="w-5 h-5" />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-medium truncate text-gray-800 dark:text-white">
            {comment.user_name}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatDate(comment.created_at)}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm break-words leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  </div>
));

// Comment Form
const CommentForm = memo(({ projectId, onSubmit, isSubmitting }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    mode: 'onTouched',
  });

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        if (e.target) e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        if (e.target) e.target.value = '';
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const onFormSubmit = useCallback((data) => {
    onSubmit({
      project_id: projectId,
      user_name: data.name,
      content: data.message,
      imageFile,
    });
    reset();
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onSubmit, imageFile, projectId, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Your name"
          {...register('name')}
          className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.name
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
            }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <textarea
          placeholder="Write your comment..."
          {...register('message')}
          className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[80px] ${errors.message
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-white/10 focus:border-indigo-500'
            }`}
        />
        {errors.message && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div className="flex items-center gap-3">
        {imagePreview ? (
          <div className="flex items-center gap-3 flex-1">
            <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm"
          >
            <ImagePlus className="w-4 h-4" />
            Add Photo
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Post Comment
          </>
        )}
      </button>
    </form>
  );
});

// Main Component
const ProjectComments = ({ projectId }) => {
  const { data: comments = [], isLoading, error } = useProjectComments(projectId);
  const addCommentMutation = useAddProjectComment();
  const [localError, setLocalError] = useState('');

  const uploadImage = useCallback(async (imageFile) => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
    return data.publicUrl;
  }, []);

  const handleCommentSubmit = useCallback(async ({ project_id, user_name, content, imageFile }) => {
    try {
      const profileImageUrl = await uploadImage(imageFile);

      await addCommentMutation.mutateAsync({
        project_id: project_id,
        user_name: user_name,
        content: content,
        profile_image: profileImageUrl,
        created_at: new Date().toISOString()
      });

      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error('Error adding comment: ', error);
      toast.error("Failed to post comment. Please try again.");
    }
  }, [uploadImage, addCommentMutation]);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(date);
  }, []);

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6 hover:border-white/20 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/20">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Comments <span className="text-indigo-400">({comments.length})</span>
        </h3>
      </div>

      {/* Error */}
      {(localError || error) && (
        <div className="flex items-center gap-2 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{localError || error?.message}</p>
        </div>
      )}

      {/* Form */}
      <CommentForm
        projectId={projectId}
        onSubmit={handleCommentSubmit}
        isSubmitting={addCommentMutation.isPending}
      />

      {/* Comments List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pt-1 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6">
            <UserCircle2 className="w-10 h-10 text-indigo-400 mx-auto mb-2 opacity-50" />
            <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectComments;