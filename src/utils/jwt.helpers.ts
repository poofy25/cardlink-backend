/**
 * Converts JWT expiration time string to milliseconds
 * Supports formats like: '15m', '1h', '7d', '30s', etc.
 *
 * @param expiration - JWT expiration time string (e.g., '15m', '1h', '7d')
 * @returns The expiration time in milliseconds
 * @throws Error if the format is invalid
 *
 * @example
 * parseJwtExpirationToMs('15m') // returns 900000 (15 minutes in ms)
 * parseJwtExpirationToMs('1h')  // returns 3600000 (1 hour in ms)
 * parseJwtExpirationToMs('7d')  // returns 604800000 (7 days in ms)
 */
export function parseJwtExpirationToMs(expiration: string): number {
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid JWT expiration format: ${expiration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
}
