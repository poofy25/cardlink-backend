import { LinkType } from './link-schemas';
import { LinkConfig } from './link-config';

/**
 * Ultra simple URL transformer - only 4 generic functions needed!
 */

/**
 * Detects if a string is already a URL
 */
function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detects if a string is a username (starts with @ or is just alphanumeric)
 */
function isUsername(value: string): boolean {
  return /^@?[a-zA-Z0-9._]+$/.test(value.trim());
}

/**
 * Detects if a string is an email address
 */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Detects if a string is a phone number
 */
function isPhoneNumber(value: string): boolean {
  return /^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''));
}

/**
 * Detects if a string looks like a domain
 */
function isDomain(value: string): boolean {
  return value.includes('.') && !value.includes(' ') && !value.startsWith('http');
}

/**
 * Transforms input into appropriate URL based on link type
 * Uses the simple config to determine how to transform
 */
export function transformToUrl(type: LinkType, input: string): string | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const trimmedInput = input.trim();

  // If it's already a URL, return as-is
  if (isUrl(trimmedInput)) {
    return trimmedInput;
  }

  const config = LinkConfig[type];
  if (!config) {
    return null;
  }

  const { transform } = config;

  switch (transform.type) {
    case 'username':
      if (isUsername(trimmedInput)) {
        const username = trimmedInput.startsWith('@') 
          ? trimmedInput.slice(1) 
          : trimmedInput;
        return `${transform.baseUrl}/${username}`;
      }
      break;

    case 'email':
      if (isEmail(trimmedInput)) {
        return `${transform.protocol}${trimmedInput}`;
      }
      break;

    case 'phone':
      if (isPhoneNumber(trimmedInput)) {
        const cleanNumber = trimmedInput.replace(/[\s\-()]/g, '');
        return `${transform.protocol}${cleanNumber}`;
      }
      break;

    case 'domain':
      if (isDomain(trimmedInput)) {
        return `https://${trimmedInput}`;
      }
      break;
  }

  return null;
}

/**
 * Validates if a URL is appropriate for the given link type
 */
export function validateUrlForType(type: LinkType, url: string): boolean {
  if (!url || !isUrl(url)) {
    return false;
  }

  const config = LinkConfig[type];
  if (!config) {
    return false;
  }

  return config.validationPattern.test(url);
}