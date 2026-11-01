import { z } from 'zod';

export const certificateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),

    issuer: z
        .string()
        .trim()
        .min(1, 'Issuer is required')
        .min(2, 'Issuer must be at least 2 characters')
        .max(100, 'Issuer must be less than 100 characters'),

    date: z
        .string()
        .trim()
        .min(1, 'Date is required'),

    // image_url رو حذف کن یا optional بذار
    image_url: z.string().optional(),
});