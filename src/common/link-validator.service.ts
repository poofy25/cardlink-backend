import { Injectable } from '@nestjs/common';
import { BaseLinkDto } from '../links/dto/base-link.dto';
import { isLinkComplete } from '../configs/links/link-validator';
import { transformToUrl } from '../configs/links/url-transformer';
import { LinkType } from '../configs/links/link-schemas';
import { LinkConfig } from '../configs/links/link-config';

export interface ValidationErrors {
  title?: string;
  rawInput?: string;
}

/**
 * Validates the title field
 * @param title - The title to validate
 * @returns Error message if invalid, undefined if valid
 */
function validateTitle(title?: string): string | undefined {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  
  if (title.length > 160) {
    return 'Title must be 160 characters or less';
  }
  
  return undefined;
}

export interface ProcessedLink {
  title: string;
  url: string | undefined;
  isIncomplete: boolean;
  type: LinkType;
  orderIndex?: number;
  isActive?: boolean;
  meta?: Record<string, unknown>;
  validationErrors?: ValidationErrors;
}

export interface ProcessedLinkResponse {
  processedLink: ProcessedLink;
  error?: string;
}

@Injectable()
export class LinkValidatorService {

  /**
   * Processes a single link by transforming the URL and determining completion status
   * @param dto - The link data to process
   * @returns Processed link response with processed link and optional error
   */
  processLink(dto: BaseLinkDto): ProcessedLinkResponse {
    // Get rawInput from meta.rawInput instead of url field
    const rawInput = (dto.meta?.rawInput as string) || '';
    
    // Validate title
    const titleError = validateTitle(dto.title);
    
    // Transform and validate rawInput in one step
    const transformResult = dto.type && rawInput ? transformToUrl(dto.type, rawInput) : { url: null, validationError: rawInput ? 'Input is required' : undefined };
    
    // Create validation errors object
    const validationErrors: ValidationErrors = {};
    if (titleError) {
      validationErrors.title = titleError;
    }
    if (transformResult.validationError) {
      validationErrors.rawInput = transformResult.validationError;
    }

    // Set title to displayName from config if no title provided
    let finalTitle = dto.title || '';
    if (!finalTitle && dto.type) {
      const config = LinkConfig[dto.type];
      if (config) {
        finalTitle = config.displayName;
      }
    }

    // Determine if the link is complete based on title and rawInput
    const isComplete = isLinkComplete(
      dto.type,
      finalTitle,
      rawInput,
    );

    const isActive = !isComplete ? false : dto.isActive;

    // Store raw input and validation errors in meta field for frontend display
    const meta = {
      ...dto.meta,
      rawInput: rawInput,
      validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined,
    };

    const processedLink: ProcessedLink = {
      title: finalTitle,
      url: transformResult.url || "",
      isIncomplete: !isComplete,
      type: dto.type,
      orderIndex: dto.orderIndex,
      isActive: isActive,
      meta: meta,
    };

    return {
      processedLink,
    };
  }

  /**
   * Processes an array of links
   * @param links - Array of link DTOs to process
   * @returns Array of processed link responses
   */
  processLinks(links: BaseLinkDto[]): ProcessedLinkResponse[] {
    return links.map(link => this.processLink(link));
  }

  /**
   * Validates if a link is complete without processing it
   * @param dto - The link data to validate
   * @returns True if the link is complete, false otherwise
   */
  validateLink(dto: BaseLinkDto): boolean {
    const response = this.processLink(dto);
    return !response.processedLink.isIncomplete;
  }

  /**
   * Gets the display name for a link type
   * @param type - The link type
   * @returns The display name or undefined if type not found
   */
  getDisplayNameForType(type: LinkType): string | undefined {
    const config = LinkConfig[type];
    return config?.displayName;
  }

}
