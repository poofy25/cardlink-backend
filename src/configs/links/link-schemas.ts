// Simplified link types - just the essentials
export const LinkTypes = [
  'instagram',
  'email', 
  'phone',
  'website',
  'custom-link'
] as const;

export type LinkType = typeof LinkTypes[number];

// URL patterns are now defined in link-config.ts - no duplication!

import { z } from 'zod';

// Simple validation for basic link fields
export const LinkValidationSchema = z.object({
  title: z.string().min(1).max(160),
  url: z.string().url(),
  type: z.enum(LinkTypes as unknown as [string, ...string[]]),
  orderIndex: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  meta: z.record(z.string(), z.unknown()).optional()
});

// No special metadata schemas needed for the simplified link types
