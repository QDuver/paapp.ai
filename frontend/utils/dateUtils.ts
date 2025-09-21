/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Get current date in YYYY-MM-DD format
 * @returns Current date formatted as YYYY-MM-DD
 */
export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date object to YYYY-MM-DD string
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD string to Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};
