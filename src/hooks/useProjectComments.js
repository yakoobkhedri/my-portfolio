import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

// ① واکشی همه نظرات پروژه‌ها (برای پنل ادمین)
export const useAllProjectComments = () => {
  return useQuery({
    queryKey: ["all_project_comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select(`
          *,
          projects:project_id (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

// ② واکشی کامنت‌های یه پروژه خاص
export const useProjectComments = (projectId) => {
  return useQuery({
    queryKey: ["project_comments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
};

// ③ اضافه کردن کامنت جدید
export const useAddProjectComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from("project_comments")
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["project_comments", data.project_id]
      });
      queryClient.invalidateQueries({ queryKey: ["all_project_comments"] });
    },
  });
};

// ④ حذف کامنت
export const useDeleteProjectComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("project_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_project_comments"] });
      queryClient.invalidateQueries({ queryKey: ["project_comments"] });
    },
  });
};