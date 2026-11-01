import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      // واکشی همه آمار به صورت موازی
      const [
        projectsResult,
        certificatesResult,
        messagesResult,
        commentsResult,
        viewsResult,
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("*"),
        supabase.from("comments").select("id", { count: "exact", head: true }),
        supabase.from("project_views").select("view_count"),
      ]);

      // خطاها
      if (projectsResult.error) throw projectsResult.error;
      if (certificatesResult.error) throw certificatesResult.error;
      if (messagesResult.error) throw messagesResult.error;
      if (commentsResult.error) throw commentsResult.error;
      if (viewsResult.error) throw viewsResult.error;

      // محاسبه آمار
      const messages = messagesResult.data || [];
      const unreadMessages = messages.filter((m) => !m.is_read).length;
      const totalViews = (viewsResult.data || []).reduce(
        (sum, item) => sum + (item.view_count || 0),
        0
      );

      return {
        projects: projectsResult.count || 0,
        certificates: certificatesResult.count || 0,
        messages: messages.length,
        unreadMessages,
        comments: commentsResult.count || 0,
        totalViews,
      };
    },
    staleTime: 1000 * 60, // ۱ دقیقه
  });
};

// ✅ آمار پیشرفته برای نمودارها
export const useAdvancedStats = () => {
  return useQuery({
    queryKey: ["advanced_stats"],
    queryFn: async () => {
      const [
        projectsResult,
        messagesResult,
        commentsResult,
        projectCommentsResult,
        viewsResult,
      ] = await Promise.all([
        supabase.from("projects").select("id, category, created_at"),
        supabase.from("messages").select("id, is_read, created_at"),
        supabase.from("comments").select("id, created_at"),
        supabase.from("project_comments").select("id, created_at"),
        supabase.from("project_views").select("project_id, view_count"),
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (messagesResult.error) throw messagesResult.error;
      if (commentsResult.error) throw commentsResult.error;
      if (projectCommentsResult.error) throw projectCommentsResult.error;
      if (viewsResult.error) throw viewsResult.error;

      const projects = projectsResult.data || [];
      const messages = messagesResult.data || [];
      const comments = commentsResult.data || [];
      const projectComments = projectCommentsResult.data || [];
      const views = viewsResult.data || [];

      // ① توزیع پروژه‌ها بر اساس دسته‌بندی
      const categoryCount = {};
      projects.forEach((p) => {
        const cat = p.category || "Other";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
      }));

      // ② پیام‌ها: خوانده‌شده vs خوانده‌نشده
      const messageStatusData = [
        {
          name: "Read",
          value: messages.filter((m) => m.is_read).length,
        },
        {
          name: "Unread",
          value: messages.filter((m) => !m.is_read).length,
        },
      ];

      // ③ فعالیت ۷ روز اخیر (پیام‌ها + کامنت‌ها)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayMessages = messages.filter((m) => {
          const d = new Date(m.created_at);
          return d >= date && d < nextDate;
        }).length;

        const dayComments = comments.filter((c) => {
          const d = new Date(c.created_at);
          return d >= date && d < nextDate;
        }).length;

        const dayProjectComments = projectComments.filter((c) => {
          const d = new Date(c.created_at);
          return d >= date && d < nextDate;
        }).length;

        last7Days.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          messages: dayMessages,
          comments: dayComments + dayProjectComments,
        });
      }

      // ④ بازدید پروژه‌ها (Top 5)
      const viewsData = views
        .map((v) => ({
          projectId: v.project_id,
          views: v.view_count || 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // گرفتن عنوان پروژه‌ها
      const projectIds = viewsData.map((v) => v.projectId);
      const { data: projectTitles } = await supabase
        .from("projects")
        .select("id, title")
        .in("id", projectIds);

      const viewsWithTitles = viewsData.map((v) => ({
        name: projectTitles?.find((p) => p.id === v.projectId)?.title || `Project ${v.projectId}`,
        views: v.views,
      }));

      return {
        categoryData,
        messageStatusData,
        last7Days,
        viewsData: viewsWithTitles,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};