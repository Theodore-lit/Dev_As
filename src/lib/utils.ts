/**
 * Utility function to combine classnames conditionally
 * Simple implementation without external dependencies
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes
    .filter((c) => typeof c === 'string')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
