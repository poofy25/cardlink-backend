import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from '../links/dto/create-link.dto';
import { isLinkComplete } from '../configs/links/link-validator';
import { transformToUrl } from '../configs/links/url-transformer';
import { LinkType } from '../configs/links/link-schemas';
import { LinkConfig } from '../configs/links/link-config';

export interface ProcessedLink {
  title: string;
  url: string | undefined;
  isIncomplete: boolean;
  type?: string;
  orderIndex?: number;
  isActive?: boolean;
  iconKey?: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class LinkValidatorService {
  /**
   * Processes a single link by transforming the URL and determining completion status
   * @param dto - The link data to process
   * @returns Processed link with transformed URL and completion status
   */
  processLink(dto: CreateLinkDto): ProcessedLink {
    const rawInput = dto.url || '';
    
    // Start with empty URL - only set if rawInput successfully transforms
    let finalUrl: string | undefined = undefined;
    
    // Try to transform the rawInput into a valid URL
    if (dto.type && rawInput) {
      const transformedUrl = transformToUrl(dto.type as LinkType, rawInput);
      // Only set the URL if transformation was successful
      if (transformedUrl) {
        finalUrl = transformedUrl;
      }
    }

    // Set title to displayName from config if no title provided
    let finalTitle = dto.title || '';
    if (!finalTitle && dto.type) {
      const config = LinkConfig[dto.type as LinkType];
      if (config) {
        finalTitle = config.displayName;
      }
    }

    // Determine if the link is complete based on title and URL
    const isComplete = isLinkComplete(
      dto.type as LinkType,
      finalTitle,
      finalUrl || undefined,
    );

    // Store raw input in meta field for frontend display
    const meta = {
      ...dto.meta,
      rawInput: rawInput,
    };

    return {
      title: finalTitle,
      url: finalUrl,
      isIncomplete: !isComplete,
      type: dto.type,
      orderIndex: dto.orderIndex,
      isActive: !isComplete ? false : dto.isActive,
      iconKey: dto.iconKey,
      meta: meta,
    };
  }

  /**
   * Processes an array of links
   * @param links - Array of link DTOs to process
   * @returns Array of processed links
   */
  processLinks(links: CreateLinkDto[]): ProcessedLink[] {
    return links.map(link => this.processLink(link));
  }

  /**
   * Validates if a link is complete without processing it
   * @param dto - The link data to validate
   * @returns True if the link is complete, false otherwise
   */
  validateLink(dto: CreateLinkDto): boolean {
    const processed = this.processLink(dto);
    return !processed.isIncomplete;
  }

  /**
   * Gets the display name for a link type
   * @param type - The link type
   * @returns The display name or undefined if type not found
   */
  getDisplayNameForType(type: string): string | undefined {
    const config = LinkConfig[type as LinkType];
    return config?.displayName;
  }
}
