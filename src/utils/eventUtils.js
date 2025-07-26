/**
 * Event Validation Utilities
 * Helper functions to safely handle DOM events and prevent null reference errors
 */

/**
 * Safely get bounding rectangle from an event target
 * @param {Event} event - DOM event object
 * @returns {DOMRect|null} Bounding rectangle or null if invalid
 */
export const safeGetBoundingRect = (event) => {
  try {
    if (!event || !event.currentTarget) {
      console.warn('safeGetBoundingRect: Invalid event or currentTarget');
      return null;
    }

    // Check if element is still in DOM
    if (!document.body.contains(event.currentTarget)) {
      console.warn('safeGetBoundingRect: Element no longer in DOM');
      return null;
    }

    return event.currentTarget.getBoundingClientRect();
  } catch (error) {
    console.error('safeGetBoundingRect: Error getting bounding rect', error);
    return null;
  }
};

/**
 * Safely extract event target value
 * @param {Event} event - DOM event object
 * @returns {any} Event target value or null if invalid
 */
export const safeGetTargetValue = (event) => {
  try {
    if (!event || !event.target) {
      console.warn('safeGetTargetValue: Invalid event or target');
      return null;
    }

    return event.target.value;
  } catch (error) {
    console.error('safeGetTargetValue: Error getting target value', error);
    return null;
  }
};

/**
 * Safely extract checked state from checkbox events
 * @param {Event} event - DOM event object
 * @returns {boolean} Checked state or false if invalid
 */
export const safeGetCheckedState = (event) => {
  try {
    if (!event || !event.target) {
      console.warn('safeGetCheckedState: Invalid event or target');
      return false;
    }

    return Boolean(event.target.checked);
  } catch (error) {
    console.error('safeGetCheckedState: Error getting checked state', error);
    return false;
  }
};

/**
 * Validate that an event object is safe to use
 * @param {Event} event - DOM event object
 * @returns {boolean} True if event is valid and safe to use
 */
export const isValidEvent = (event) => {
  if (!event) {
    return false;
  }

  // Check for required properties
  if (typeof event.preventDefault !== 'function') {
    return false;
  }

  return true;
};

/**
 * Validate that an event has a valid currentTarget for getBoundingClientRect
 * @param {Event} event - DOM event object
 * @returns {boolean} True if currentTarget is valid for getBoundingClientRect
 */
export const hasValidCurrentTarget = (event) => {
  if (!isValidEvent(event)) {
    return false;
  }

  if (!event.currentTarget) {
    return false;
  }

  // Check if currentTarget has getBoundingClientRect method
  if (typeof event.currentTarget.getBoundingClientRect !== 'function') {
    return false;
  }

  // Check if element is still in DOM
  if (!document.body.contains(event.currentTarget)) {
    return false;
  }

  return true;
};

/**
 * Create a safe event handler wrapper
 * @param {Function} handler - Original event handler
 * @param {Object} options - Options for error handling
 * @returns {Function} Wrapped handler with error protection
 */
export const createSafeEventHandler = (handler, options = {}) => {
  const { 
    validateCurrentTarget = false,
    fallback = () => {},
    logErrors = true
  } = options;

  return (event, ...args) => {
    try {
      // Basic event validation
      if (!isValidEvent(event)) {
        if (logErrors) {
          console.warn('createSafeEventHandler: Invalid event object');
        }
        return fallback(event, ...args);
      }

      // Additional currentTarget validation if required
      if (validateCurrentTarget && !hasValidCurrentTarget(event)) {
        if (logErrors) {
          console.warn('createSafeEventHandler: Invalid currentTarget');
        }
        return fallback(event, ...args);
      }

      return handler(event, ...args);
    } catch (error) {
      if (logErrors) {
        console.error('createSafeEventHandler: Error in event handler', error);
      }
      return fallback(event, ...args);
    }
  };
};

export default {
  safeGetBoundingRect,
  safeGetTargetValue,
  safeGetCheckedState,
  isValidEvent,
  hasValidCurrentTarget,
  createSafeEventHandler
};
