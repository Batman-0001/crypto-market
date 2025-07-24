import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  parseISO,
  getWeek,
  getMonth,
  getYear,
} from "date-fns";

/**
 * Utility functions for date operations and calendar management
 */

/**
 * Generate calendar days for a given month
 * @param {Date} date - The date to generate calendar for
 * @returns {Array} Array of calendar days
 */
export const generateCalendarDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
};

/**
 * Generate calendar weeks for a given month
 * @param {Date} date - The date to generate calendar for
 * @returns {Array} Array of calendar weeks
 */
export const generateCalendarWeeks = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return eachWeekOfInterval({
    start: monthStart,
    end: monthEnd,
  });
};

/**
 * Generate calendar months for a given year
 * @param {Date} date - The date to generate calendar for
 * @returns {Array} Array of calendar months
 */
export const generateCalendarMonths = (date) => {
  const yearStart = new Date(getYear(date), 0, 1);
  const yearEnd = new Date(getYear(date), 11, 31);

  return eachMonthOfInterval({
    start: yearStart,
    end: yearEnd,
  });
};

/**
 * Navigate to previous period
 * @param {Date} currentDate - Current date
 * @param {string} viewType - View type ('daily', 'weekly', 'monthly')
 * @returns {Date} Previous period date
 */
export const navigateToPrevious = (currentDate, viewType) => {
  switch (viewType) {
    case "weekly":
      return subMonths(currentDate, 1);
    case "monthly":
      return new Date(getYear(currentDate) - 1, getMonth(currentDate), 1);
    case "daily":
    default:
      return subMonths(currentDate, 1);
  }
};

/**
 * Navigate to next period
 * @param {Date} currentDate - Current date
 * @param {string} viewType - View type ('daily', 'weekly', 'monthly')
 * @returns {Date} Next period date
 */
export const navigateToNext = (currentDate, viewType) => {
  switch (viewType) {
    case "weekly":
      return addMonths(currentDate, 1);
    case "monthly":
      return new Date(getYear(currentDate) + 1, getMonth(currentDate), 1);
    case "daily":
    default:
      return addMonths(currentDate, 1);
  }
};

/**
 * Format date for display based on view type
 * @param {Date} date - Date to format
 * @param {string} viewType - View type
 * @returns {string} Formatted date string
 */
export const formatDateForView = (date, viewType) => {
  switch (viewType) {
    case "weekly":
      return format(date, "MMM yyyy");
    case "monthly":
      return format(date, "yyyy");
    case "daily":
    default:
      return format(date, "MMMM yyyy");
  }
};

/**
 * Get calendar cell key for data mapping
 * @param {Date} date - Date for the cell
 * @param {string} viewType - View type
 * @returns {string} Unique key for the cell
 */
export const getCalendarCellKey = (date, viewType) => {
  switch (viewType) {
    case "weekly":
      return `${getYear(date)}-W${getWeek(date)}`;
    case "monthly":
      return `${getYear(date)}-${getMonth(date) + 1}`;
    case "daily":
    default:
      return format(date, "yyyy-MM-dd");
  }
};

/**
 * Check if a date is in the current month
 * @param {Date} date - Date to check
 * @param {Date} currentMonth - Current month reference
 * @returns {boolean} True if date is in current month
 */
export const isInCurrentMonth = (date, currentMonth) => {
  return (
    getMonth(date) === getMonth(currentMonth) &&
    getYear(date) === getYear(currentMonth)
  );
};

/**
 * Check if a date is the same as another date
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same
 */
export const isSameDate = (date1, date2) => {
  return isSameDay(date1, date2);
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isDateToday = (date) => {
  return isToday(date);
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date} Parsed date object
 */
export const parseDate = (dateString) => {
  return parseISO(dateString);
};

/**
 * Get week number for a date
 * @param {Date} date - Date to get week number for
 * @returns {number} Week number
 */
export const getWeekNumber = (date) => {
  return getWeek(date);
};

/**
 * Get month number for a date
 * @param {Date} date - Date to get month number for
 * @returns {number} Month number (0-11)
 */
export const getMonthNumber = (date) => {
  return getMonth(date);
};

/**
 * Get year for a date
 * @param {Date} date - Date to get year for
 * @returns {number} Year
 */
export const getYearNumber = (date) => {
  return getYear(date);
};
