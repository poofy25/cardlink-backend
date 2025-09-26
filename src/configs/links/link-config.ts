import { LinkType } from './link-schemas';

// config - just 5 essential link types
export const LinkConfig: Record<
  LinkType,
  {
    displayName: string;
    category: string;
    icon: string;
    description: string;
    example: string;
    // Everything needed for transformation and validation
    transform: {
      type: 'username' | 'email' | 'phone' | 'domain';
      baseUrl?: string;
      protocol?: string;
    };
    validationPattern: RegExp;
  }
> = {
  instagram: {
    displayName: 'Instagram',
    category: 'social',
    icon: 'instagram',
    description: 'Share your Instagram profile',
    example: '@john_doe or https://instagram.com/john_doe',
    transform: {
      type: 'username',
      baseUrl: 'https://instagram.com',
    },
    validationPattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+$/,
  },

  email: {
    displayName: 'Email',
    category: 'communication',
    icon: 'email',
    description: 'Send an email',
    example: 'john@example.com',
    transform: {
      type: 'email',
      protocol: 'mailto:',
    },
    validationPattern: /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  phone: {
    displayName: 'Phone',
    category: 'communication',
    icon: 'phone',
    description: 'Make a phone call',
    example: '+1234567890',
    transform: {
      type: 'phone',
      protocol: 'tel:',
    },
    validationPattern: /^tel:\+?[1-9][\d\s\-()]{7,20}$/,
  },

  website: {
    displayName: 'Website',
    category: 'web',
    icon: 'globe',
    description: 'Personal or business website',
    example: 'mywebsite.com or https://mywebsite.com',
    transform: {
      type: 'domain',
    },
    validationPattern: /^https?:\/\/.+/,
  },

  'custom-link': {
    displayName: 'Custom Link',
    category: 'custom',
    icon: 'link',
    description: 'Any other link',
    example: 'https://example.com',
    transform: {
      type: 'domain',
    },
    validationPattern: /^https?:\/\/.+/,
  },
};
