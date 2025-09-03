/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date formatted as YYYY-MM-DD
 */
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date object to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD string to Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export const parseDate = (dateString) => {
  return new Date(dateString + 'T00:00:00.000Z');
};
