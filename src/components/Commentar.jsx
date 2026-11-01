import React, { useState, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import { supabase } from '../supabase';
import { useComments, usePinnedComment, useAddComment } from '../hooks/useComments';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '../schemas/commentSchema';
import toast from "react-hot-toast";

const Comment = memo(({ comment, formatDate, isPinned = false }) => (
    <div
        className={`px-4 pt-4 pb-2 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${isPinned
            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30'
            : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-indigo-500 dark:text-indigo-400">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0 ${isPinned ? 'border-indigo-500/50' : 'border-indigo-500/30'
                        }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-indigo-500 dark:text-indigo-400 ${isPinned ? 'bg-indigo-500/30' : 'bg-indigo-500/20'
                    }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${isPinned ? 'text-indigo-700 dark:text-indigo-200' : 'text-gray-800 dark:text-white'
                            }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));


const CommentForm = memo(({ onSubmit, isSubmitting }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // ✅ React Hook Form
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
            newComment: data.message,
            userName: data.name,
            imageFile,
        });
        reset(); // پاک کردن فرم
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [onSubmit, imageFile, reset]);

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

            {/* Name */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    {...register('name')}
                    className={`w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.name
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
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="Write your message here..."
                    {...register('message')}
                    className={`w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 border transition-all text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[120px] ${errors.message
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

            {/* Profile Photo */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
                    Profile Photo <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img src={imagePreview} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50" />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all border border-dashed border-indigo-500/50"
                            >
                                <ImagePlus className="w-5 h-5" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">Max file size: 5MB</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Commentar = () => {
    // ✅ React Query hooks
    const { data: comments = [], isLoading: isLoadingComments, error: commentsError } = useComments();
    const { data: pinnedComment, isLoading: isLoadingPinned } = usePinnedComment();
    const addCommentMutation = useAddComment();

    const [error, setError] = useState('');

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

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        try {
            const profileImageUrl = await uploadImage(imageFile);

            await addCommentMutation.mutateAsync({
                content: newComment,
                user_name: userName,
                profile_image: profileImageUrl,
                is_pinned: false,
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

    const totalComments = comments.length + (pinnedComment ? 1 : 0);
    const isLoading = isLoadingComments || isLoadingPinned;

    return (
        <div className="w-full bg-gray-50 dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 rounded-2xl backdrop-blur-xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-transparent">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                        <MessageCircle className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Comments <span className="text-indigo-500 dark:text-indigo-400">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {(error || commentsError) && (
                    <div className="flex items-center gap-2 p-4 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error || commentsError?.message}</p>
                    </div>
                )}

                <CommentForm
                    onSubmit={handleCommentSubmit}
                    isSubmitting={addCommentMutation.isPending}
                />

                <div className="space-y-4 h-[328px] overflow-y-auto custom-scrollbar pt-1 pr-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {pinnedComment && (
                                <Comment comment={pinnedComment} formatDate={formatDate} isPinned={true} />
                            )}

                            {comments.length === 0 && !pinnedComment ? (
                                <div className="text-center py-8">
                                    <UserCircle2 className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-3 opacity-50" />
                                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Start the conversation!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        comment={comment}
                                        formatDate={formatDate}
                                        isPinned={false}
                                    />
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Commentar;