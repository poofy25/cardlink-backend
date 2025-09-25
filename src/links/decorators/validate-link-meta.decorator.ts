import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validateLinkMeta } from '../../configs/links/link-validator';
import { LinkType } from '../../configs/links/link-schemas';

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
            const validatedMeta = validateLinkMeta(value.type as LinkType, value.meta);
            return !!validatedMeta;
          }
          
          // Handle array of links
          if (Array.isArray(value)) {
            return value.every(link => {
              if (!isLinkWithMeta(link)) return true; // Skip links without type/meta
              const validatedMeta = validateLinkMeta(link.type as LinkType, link.meta);
              return !!validatedMeta;
            });
          }
          
          return true; // Skip validation for other types
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value as unknown;
          
          if (isLinkWithMeta(value)) {
            return `Invalid meta data for link type '${value.type}'. Please check the required fields.`;
          }
          
          if (Array.isArray(value)) {
            const invalidLinks = value
              .map((link: unknown, index: number) => {
                if (isLinkWithMeta(link)) {
                  const validatedMeta = validateLinkMeta(link.type as LinkType, link.meta);
                  return validatedMeta ? null : `Link at index ${index}`;
                }
                return null;
              })
              .filter(Boolean);
              
            return invalidLinks.length > 0 
              ? `Invalid meta data for: ${invalidLinks.join(', ')}`
              : 'Invalid link meta data';
          }
          
          return 'Invalid link meta data';
        },
      },
    });
  };
}
