import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useMemo } from "react";

// ① واکشی همه پروژه‌ها
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// ② واکشی یه پروژه خاص
export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// ③ اضافه کردن پروژه جدید
export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ④ ویرایش پروژه
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ⑤ حذف پروژه
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ✅ واکشی پروژه با Slug
export const useProjectBySlug = (slug) => {
  return useQuery({
    queryKey: ["project", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*");

      if (error) throw error;

      // پیدا کردن پروژه با slug
      const { toSlug } = await import("../utils/slug");
      const project = data?.find((p) => toSlug(p.title) === slug);

      if (!project) throw new Error("Project not found");
      return project;
    },
    enabled: !!slug,
  });
};

// ✅ هوک فیلتر و جستجو
export const useFilteredProjects = (projects, searchTerm, category) => {
  return useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      // فیلتر دسته‌بندی
      const matchesCategory =
        category === 'All' ||
        project.category?.toLowerCase() === category.toLowerCase();

      // جستجو
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.technologies?.some(tech =>
          tech.toLowerCase().includes(searchLower)
        );

      return matchesCategory && matchesSearch;
    });
  }, [projects, searchTerm, category]);
};