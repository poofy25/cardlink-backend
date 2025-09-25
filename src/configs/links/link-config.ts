import { LinkType } from './link-schemas';

export const LinkConfig: Record<LinkType, {
  displayName: string;
  category: string;
  icon: string;
  description: string;
  defaultUrl?: string;
  id: LinkType;
}> = {
  instagram: {
    id: 'instagram',
    displayName: 'Instagram',
    category: 'social',
    icon: 'instagram',
    description: 'Share your Instagram profile',
    defaultUrl: 'https://instagram.com/{username}',
  },
  email: {
    id: 'email',
    displayName: 'Email',
    category: 'communication',
    icon: 'email',
    description: 'Send an email',
    defaultUrl: 'mailto:{email}',
  },
  phone: {
    id: 'phone',
    displayName: 'Phone',
    category: 'communication',
    icon: 'phone',
    description: 'Make a phone call',
    defaultUrl: 'tel:{phoneNumber}',
  },
  address: {
    id: 'address',
    displayName: 'Address',
    category: 'location',
    icon: 'map-pin',
    description: 'Share a physical address',
    defaultUrl: 'https://maps.google.com/maps?q={street},{city},{state},{country}',
  },
  'custom-link': {
    id: 'custom-link',
    displayName: 'Custom Link',
    category: 'custom',
    icon: 'custom-link',
    description: 'Add a custom link',
  },
};
