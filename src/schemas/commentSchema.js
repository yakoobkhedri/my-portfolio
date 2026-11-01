import { z } from 'zod';

export const commentSchema = z.object({
  name: z
    .string()
    .trim() // فاصله‌های اضافه رو حذف کن
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(15, 'Name must be less than 15 characters'),
  
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .min(5, 'Message must be at least 5 characters')
    .max(200, 'Message must be less than 200 characters')
    .refine((val) => !val.includes('http'), {
      message: 'Links are not allowed in comments',
    }),
});