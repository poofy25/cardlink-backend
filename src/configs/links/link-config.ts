// IMPORTANT: THIS FILE SHOULD BE KEPT IN SYNC WITH THE FRONTEND CONFIG

import { LinkType } from "./link-schemas";

export type LinkConfig = Record<
  LinkType,
  {
    displayName: string;
    category: string;
    icon: string;
    description: string;
    example: string;
    inputLabel: string;
    transform: {
      // for now i dont think we need to use any types
      type: "username" | "email" | "phone" | "domain";
      baseUrl?: string;
      protocol?: string;
    };
    validationPattern: RegExp;
  }
>;

// config - just 5 essential link types
export const LinkConfig: LinkConfig = {
  instagram: {
    displayName: "Instagram",
    category: "social",
    icon: "instagram",
    description: "Share your Instagram profile",
    example: "@john_doe or https://instagram.com/john_doe",
    inputLabel: "URL or Username",
    transform: {
      type: "username",
      baseUrl: "https://instagram.com",
    },
    validationPattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+$/,
  },

  email: {
    displayName: "Email",
    inputLabel: "Email",
    category: "communication",
    icon: "email",
    description: "Send an email",
    example: "john@example.com",
    transform: {
      type: "email",
      protocol: "mailto:",
    },
    validationPattern: /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  phone: {
    displayName: "Phone",
    inputLabel: "Phone",
    category: "communication",
    icon: "phone",
    description: "Make a phone call",
    example: "+1234567890",
    transform: {
      type: "phone",
      protocol: "tel:",
    },
    validationPattern: /^tel:\+?[1-9][\d\s\-()]{7,20}$/,
  },
  "custom-link": {
    displayName: "Custom Link",
    inputLabel: "URL",
    category: "custom",
    icon: "link",
    description: "Any other link",
    example: "https://example.com",
    transform: {
      type: "domain",
    },
    // Accepts either a full http(s) URL or just a domain (e.g., example.com)
    validationPattern: /^(https?:\/\/.+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$)/,
  },
  facebook: {
    displayName: "Facebook",
    inputLabel: "Facebook",
    category: "social",
    icon: "facebook",
    description: "Share your Facebook profile",
    example: "https://facebook.com/john_doe",
    transform: {
      type: "username",
      baseUrl: "https://facebook.com",
    },
    validationPattern: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._]+$/,
  },
};
