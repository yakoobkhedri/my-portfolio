import { z } from 'zod';

export const projectSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),

    description: z
        .string()
        .trim()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters'),

    // image_url رو حذف کن یا optional بذار
    image_url: z.string().optional(),

    live_url: z
        .string()
        .trim()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),

    github_url: z
        .string()
        .trim()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),

    category: z
        .string()
        .trim()
        .min(1, 'Category is required')
        .max(50, 'Category must be less than 50 characters'),

    technologies: z
        .string()
        .trim()
        .optional()
        .transform((val) => {
            if (!val) return [];
            return val.split(',').map((t) => t.trim()).filter(Boolean);
        }),

    features: z
        .string()
        .trim()
        .optional()
        .transform((val) => {
            if (!val) return [];
            return val.split(',').map((f) => f.trim()).filter(Boolean);
        }),
});