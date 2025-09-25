import { z } from 'zod';

// Base schema for common fields
const BaseSchema = z.object({
  description: z.string().optional(),
  color: z.string().optional(),
});

// Link type schemas
export const InstagramSchema = BaseSchema.extend({
  username: z.string().min(1).max(30),
  displayName: z.string().optional(),
});

export const EmailSchema = BaseSchema.extend({
  email: z.string().email(),
  subject: z.string().optional(),
});

export const PhoneSchema = BaseSchema.extend({
  phoneNumber: z.string().min(7).max(20),
  countryCode: z.string().optional(),
});

export const AddressSchema = BaseSchema.extend({
  street: z.string(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
});

export const CustomLinkSchema = BaseSchema.extend({
  url: z.string().url(),
  target: z.enum(['_blank', '_self']).optional(),
});

// All schemas mapping
export const LinkSchemas = {
  instagram: InstagramSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  address: AddressSchema,
  'custom-link': CustomLinkSchema,
} as const;

// TypeScript types generated from schemas
export type InstagramMeta = z.infer<typeof InstagramSchema>;
export type EmailMeta = z.infer<typeof EmailSchema>;
export type PhoneMeta = z.infer<typeof PhoneSchema>;
export type AddressMeta = z.infer<typeof AddressSchema>;
export type CustomLinkMeta = z.infer<typeof CustomLinkSchema>;

export type LinkType = keyof typeof LinkSchemas;
export type LinkMeta = 
  | InstagramMeta 
  | EmailMeta 
  | PhoneMeta 
  | AddressMeta 
  | CustomLinkMeta;
