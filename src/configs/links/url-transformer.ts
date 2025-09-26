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
 * Also validates the input and returns validation error if transformation fails
 */
export function transformToUrl(type: LinkType, input: string): { url: string | null; validationError?: string } {
  if (!input || input.trim().length === 0) {
    return { url: null, validationError: 'Input is required' };
  }

  const trimmedInput = input.trim();

  // If it's already a URL, validate it's appropriate for the type
  if (isUrl(trimmedInput)) {
    const config = LinkConfig[type];
    if (!config) {
      return { url: null, validationError: 'Invalid link type' };
    }
    
    if (config.validationPattern.test(trimmedInput)) {
      return { url: trimmedInput };
    } else {
      return { url: null, validationError: `Please enter a valid ${config.displayName.toLowerCase()} URL` };
    }
  }

  const config = LinkConfig[type];
  if (!config) {
    return { url: null, validationError: 'Invalid link type' };
  }

  const { transform } = config;

  switch (transform.type) {
    case 'username': {
      if (!isUsername(trimmedInput)) {
        return { url: null, validationError: 'Please enter a valid username (e.g., @username or username)' };
      }
      const username = trimmedInput.startsWith('@') 
        ? trimmedInput.slice(1) 
        : trimmedInput;
      return { url: `${transform.baseUrl}/${username}` };
    }

    case 'email': {
      if (!isEmail(trimmedInput)) {
        return { url: null, validationError: 'Please enter a valid email address' };
      }
      return { url: `${transform.protocol}${trimmedInput}` };
    }

    case 'phone': {
      if (!isPhoneNumber(trimmedInput)) {
        return { url: null, validationError: 'Please enter a valid phone number' };
      }
      const cleanNumber = trimmedInput.replace(/[\s\-()]/g, '');
      return { url: `${transform.protocol}${cleanNumber}` };
    }

    case 'domain': {
      if (!isDomain(trimmedInput)) {
        return { url: null, validationError: 'Please enter a valid domain (e.g., example.com)' };
      }
      return { url: `https://${trimmedInput}` };
    }
  }

  return { url: null, validationError: 'Invalid input format' };
}

/**
 * Validates if a URL is appropriate for the given link type
 * @deprecated Use transformToUrl instead for validation and transformation
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