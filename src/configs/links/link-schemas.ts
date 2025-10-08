// IMPORTANT: THIS FILE SHOULD BE KEPT IN SYNC WITH THE FRONTEND CONFIG


import { z } from 'zod';
// Simplified link types - just the essentials
export enum LinkTypes {
  INSTAGRAM = 'instagram',
  EMAIL = 'email',
  PHONE = 'phone',
  CUSTOM_LINK = 'custom-link',
  FACEBOOK = 'facebook',
}

export type LinkType = LinkTypes;

// Base meta schema that all link types share
export const BaseMetaSchema = z.object({
  rawInput: z.string().trim(),
});

// Meta schemas for different link types
export const LinkMetaSchemas: Record<LinkType, z.ZodObject<z.ZodRawShape>> = {
  [LinkTypes.INSTAGRAM]: BaseMetaSchema.extend({
    // Instagram-specific meta fields can be added here
  }),
  [LinkTypes.EMAIL]: BaseMetaSchema.extend({
    // Email-specific meta fields can be added here
  }),
  [LinkTypes.PHONE]: BaseMetaSchema.extend({
    // Phone-specific meta fields can be added here
  }),
  [LinkTypes.CUSTOM_LINK]: BaseMetaSchema.extend({
    // Custom link-specific meta fields can be added here
  }),
  [LinkTypes.FACEBOOK]: BaseMetaSchema.extend({
    // Facebook-specific meta fields can be added here
  }),
} as const;

// Type for validated meta data
export type ValidatedLinkMeta = z.infer<typeof BaseMetaSchema>;
