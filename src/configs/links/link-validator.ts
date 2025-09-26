import { LinkType } from './link-schemas';
import { transformToUrl } from './url-transformer';

/**
 * Checks if a link has all required data to be considered complete
 * For most link types, this means having a title and a valid URL
 * 
 * @example
 * // ❌ Incomplete - no title
 * isLinkComplete('instagram', '', 'https://instagram.com/john')
 * 
 * @example
 * // ❌ Incomplete - no URL
 * isLinkComplete('instagram', 'My Instagram', '')
 * 
 * @example
 * // ✅ Complete - has title and URL
 * isLinkComplete('instagram', 'My Instagram', 'https://instagram.com/john')
 */
export function isLinkComplete(type: LinkType, title?: string, rawInput?: string): boolean {
  // Check if title is provided and not empty
  if (!title || title.trim().length === 0) {
    return false;
  }

  // Check if rawInput is provided and not empty
  if (!rawInput || rawInput.trim().length === 0) {
    return false;
  }

  // Try to transform the rawInput - if it succeeds, the link is complete
  const result = transformToUrl(type, rawInput);
  return result.url !== null;
}

