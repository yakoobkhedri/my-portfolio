import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

// ① واکشی همه تنظیمات
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      // تبدیل به آبجکت برای دسترسی راحت
      const settings = {};
      data?.forEach((item) => {
        settings[item.key] = item.value;
      });
      return settings;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ② آپدیت تنظیمات
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settingsObject) => {
      // تبدیل آبجکت به آرایه برای upsert
      const updates = Object.entries(settingsObject).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("site_settings")
        .upsert(updates, { onConflict: "key" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
};