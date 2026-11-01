import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

// ① واکشی آمار بازدید همه پروژه‌ها
export const useProjectViews = () => {
  return useQuery({
    queryKey: ["project_views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_views")
        .select("*");

      if (error) throw error;
      
      // تبدیل به آبجکت برای دسترسی سریع
      const viewsMap = {};
      data?.forEach((item) => {
        viewsMap[item.project_id] = item.view_count;
      });
      
      return viewsMap;
    },
  });
};

// ② واکشی آمار یه پروژه خاص
export const useProjectView = (projectId) => {
  return useQuery({
    queryKey: ["project_view", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_views")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || { view_count: 0 };
    },
    enabled: !!projectId,
  });
};

// ③ increment بازدید
export const useIncrementView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId) => {
      const { error } = await supabase.rpc("increment_project_view", {
        project_id_param: projectId,
      });

      if (error) throw error;
    },
    onSuccess: (_, projectId) => {
      // فقط آمار همون پروژه و لیست کل رو refetch کن
      queryClient.invalidateQueries({ queryKey: ["project_view", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project_views"] });
    },
  });
};