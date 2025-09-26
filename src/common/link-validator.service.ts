import { Injectable } from '@nestjs/common';
import { BaseLinkDto } from '../links/dto/base-link.dto';
import { isLinkComplete } from '../configs/links/link-validator';
import { transformToUrl } from '../configs/links/url-transformer';
import { LinkType } from '../configs/links/link-schemas';
import { LinkConfig } from '../configs/links/link-config';

export interface ProcessedLink {
  title: string;
  url: string | undefined;
  isIncomplete: boolean;
  type: LinkType;
  orderIndex?: number;
  isActive?: boolean;
  meta?: Record<string, unknown>;
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
    
    // Start with empty URL - only set if rawInput successfully transforms
    let finalUrl: string | null = null;
    
    // Try to transform the rawInput into a valid URL
    if (dto.type && rawInput) {
      const transformedUrl = transformToUrl(dto.type, rawInput);

      console.log('transformedUrl', transformedUrl);
      // Only set the URL if transformation was successful
      if (transformedUrl) {
        finalUrl = transformedUrl;
      }
    }

    // Set title to displayName from config if no title provided
    let finalTitle = dto.title || '';
    if (!finalTitle && dto.type) {
      const config = LinkConfig[dto.type];
      if (config) {
        finalTitle = config.displayName;
      }
    }

    // Determine if the link is complete based on title and URL
    const isComplete = isLinkComplete(
      dto.type,
      finalTitle,
      finalUrl || undefined,
    );

    const isActive = !isComplete ? false : dto.isActive;

    // Store raw input in meta field for frontend display
    const meta = {
      ...dto.meta,
      rawInput: rawInput,
    };

    const processedLink: ProcessedLink = {
      title: finalTitle,
      url: finalUrl || undefined,
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
