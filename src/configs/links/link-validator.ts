import { z } from 'zod';
import { LinkType, LinkSchemas } from './link-schemas';

/**
 * Validates meta object against the link type schema
 * Returns typesafe object or throws error or returns null
 */
export function validateLinkMeta<T extends LinkType>(
  type: T,
  meta: unknown,
): z.infer<(typeof LinkSchemas)[T]> | null {
  const schema = LinkSchemas[type];

  if (!schema) {
    throw new Error(`Unknown link type: ${type}`);
  }

  const result = schema.safeParse(meta);

  if (result.success) {
    return result.data as z.infer<(typeof LinkSchemas)[T]>;
  }

  // Return null for validation errors instead of throwing
  return null;
}
