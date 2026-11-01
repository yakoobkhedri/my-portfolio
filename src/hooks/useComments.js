import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

// ① واکشی همه کامنت‌ها (برای پنل ادمین)
export const useAllComments = () => {
  return useQuery({
    queryKey: ["all_comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

// ② واکشی کامنت‌های معمولی
export const useComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("is_pinned", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

// ③ واکشی کامنت پین‌شده
export const usePinnedComment = () => {
  return useQuery({
    queryKey: ["pinnedComment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("is_pinned", true)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
  });
};

// ④ اضافه کردن کامنت
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from("comments")
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["all_comments"] });
    },
  });
};

// ⑤ پین/آنپین کردن کامنت
export const useTogglePinComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_pinned }) => {
      // اگه می‌خوایم پین کنیم، اول همه رو آنپین کن
      if (is_pinned) {
        await supabase
          .from("comments")
          .update({ is_pinned: false })
          .eq("is_pinned", true);
      }

      const { data, error } = await supabase
        .from("comments")
        .update({ is_pinned })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedComment"] });
      queryClient.invalidateQueries({ queryKey: ["all_comments"] });
    },
  });
};

// ⑥ حذف کامنت
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedComment"] });
      queryClient.invalidateQueries({ queryKey: ["all_comments"] });
    },
  });
};