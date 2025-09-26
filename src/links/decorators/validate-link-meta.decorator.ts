import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { LinkType, LinkTypes } from '../../configs/links/link-schemas';

interface LinkWithMeta {
  type?: string;
  meta?: Record<string, unknown>;
}

function isLinkWithMeta(value: unknown): value is LinkWithMeta {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'meta' in value &&
    typeof (value as LinkWithMeta).type === 'string' &&
    typeof (value as LinkWithMeta).meta === 'object'
  );
}

/**
 * Validates link meta data but allows incomplete links to pass validation
 * This is useful for real-time editing where links can be created with minimal data
 * 
 * @example
 * // ✅ Valid - complete link
 * { type: 'instagram', meta: { username: 'john_doe' } }
 * 
 * @example
 * // ✅ Valid - incomplete link (allowed for real-time editing)
 * { type: 'instagram', meta: {} }
 * 
 * @example
 * // ✅ Valid - minimal link with just type
 * { type: 'email', meta: null }
 * 
 * @example
 * // ❌ Invalid - invalid link type
 * { type: 'invalid-type', meta: {} }
 * 
 * @example
 * // ❌ Invalid - meta is not an object
 * { type: 'instagram', meta: 'not-an-object' }
 */
export function ValidateLinkMeta(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateLinkMeta',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!value) return true; // Skip if no value
          
          // Handle single link object
          if (isLinkWithMeta(value)) {
            // For lenient validation, we only check if the type is valid
            // and if meta is an object (not null/undefined)
            if (!value.type || typeof value.type !== 'string') return false;
            if (value.meta !== null && typeof value.meta !== 'object') return false;
            
            // If we have both type and meta, check if it's a valid link type
            return LinkTypes.includes(value.type as LinkType);
          }
          
          // Handle array of links
          if (Array.isArray(value)) {
            return value.every(link => {
              if (!isLinkWithMeta(link)) return true; // Skip links without type/meta
              
              if (!link.type || typeof link.type !== 'string') return false;
              if (link.meta !== null && typeof link.meta !== 'object') return false;
              
              return LinkTypes.includes(link.type as LinkType);
            });
          }
          
          return true; // Skip validation for other types
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value as unknown;
          
          if (isLinkWithMeta(value)) {
            return `Invalid link type '${value.type}'. Must be one of: ${LinkTypes.join(', ')}`;
          }
          
          if (Array.isArray(value)) {
            const invalidLinks = value
              .map((link: unknown, index: number) => {
                if (isLinkWithMeta(link)) {
                  return LinkTypes.includes(link.type as LinkType) ? null : `Link at index ${index}`;
                }
                return null;
              })
              .filter(Boolean);
              
            return invalidLinks.length > 0 
              ? `Invalid link types for: ${invalidLinks.join(', ')}`
              : 'Invalid link meta data';
          }
          
          return 'Invalid link meta data';
        },
      },
    });
  };
}
