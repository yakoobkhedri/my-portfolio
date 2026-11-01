import { z } from 'zod';

export const siteSettingsSchema = z.object({
  site_name: z
    .string()
    .trim()
    .min(1, 'Site name is required')
    .max(100, 'Site name must be less than 100 characters'),
  
  site_title: z
    .string()
    .trim()
    .min(1, 'Site title is required')
    .max(100, 'Site title must be less than 100 characters'),
  
  site_description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  location: z
    .string()
    .trim()
    .optional(),
  
  github_url: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  linkedin_url: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  instagram_url: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  cv_url: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  availability: z
    .string()
    .trim()
    .optional(),
});