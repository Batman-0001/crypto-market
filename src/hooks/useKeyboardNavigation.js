import { useState, useEffect, useCallback, useRef } from "react";
import { KEYBOARD_KEYS } from "../constants";

/**
 * Custom hook for keyboard navigation in the calendar
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useKeyboardNavigation = ({
  enabled = true,
  onNavigate = () => {},
  onSelect = () => {},
  onEscape = () => {},
  onEnter = () => {},
  initialFocusDate = new Date(),
} = {}) => {
  const [focusedDate, setFocusedDate] = useState(initialFocusDate);
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef(null);

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const { key, ctrlKey, shiftKey, altKey } = event;

      // Prevent default behavior for arrow keys and other navigation keys
      if (
        [
          KEYBOARD_KEYS.ARROW_LEFT,
          KEYBOARD_KEYS.ARROW_RIGHT,
          KEYBOARD_KEYS.ARROW_UP,
          KEYBOARD_KEYS.ARROW_DOWN,
          KEYBOARD_KEYS.ENTER,
          KEYBOARD_KEYS.ESCAPE,
          KEYBOARD_KEYS.SPACE,
        ].includes(key)
      ) {
        event.preventDefault();
        setIsNavigating(true);
      }

      const currentDate = new Date(focusedDate);
      let newDate = new Date(currentDate);

      switch (key) {
        case KEYBOARD_KEYS.ARROW_LEFT:
          // Move to previous day
          if (ctrlKey) {
            // Move to previous week with Ctrl
            newDate.setDate(currentDate.getDate() - 7);
          } else {
            newDate.setDate(currentDate.getDate() - 1);
          }
          break;

        case KEYBOARD_KEYS.ARROW_RIGHT:
          // Move to next day
          if (ctrlKey) {
            // Move to next week with Ctrl
            newDate.setDate(currentDate.getDate() + 7);
          } else {
            newDate.setDate(currentDate.getDate() + 1);
          }
          break;

        case KEYBOARD_KEYS.ARROW_UP:
          // Move to previous week
          if (ctrlKey) {
            // Move to previous month with Ctrl
            newDate.setMonth(currentDate.getMonth() - 1);
          } else {
            newDate.setDate(currentDate.getDate() - 7);
          }
          break;

        case KEYBOARD_KEYS.ARROW_DOWN:
          // Move to next week
          if (ctrlKey) {
            // Move to next month with Ctrl
            newDate.setMonth(currentDate.getMonth() + 1);
          } else {
            newDate.setDate(currentDate.getDate() + 7);
          }
          break;

        case KEYBOARD_KEYS.ENTER:
        case KEYBOARD_KEYS.SPACE:
          // Select current date
          onSelect(currentDate);
          onEnter(currentDate);
          return;

        case KEYBOARD_KEYS.ESCAPE:
          // Cancel navigation or close dialogs
          setIsNavigating(false);
          onEscape();
          return;

        default:
          // Handle other special keys
          if (key === "Home") {
            // Go to first day of month
            newDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            );
          } else if (key === "End") {
            // Go to last day of month
            newDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
          } else if (key === "PageUp") {
            // Go to previous month
            if (shiftKey) {
              // Go to previous year with Shift
              newDate.setFullYear(currentDate.getFullYear() - 1);
            } else {
              newDate.setMonth(currentDate.getMonth() - 1);
            }
          } else if (key === "PageDown") {
            // Go to next month
            if (shiftKey) {
              // Go to next year with Shift
              newDate.setFullYear(currentDate.getFullYear() + 1);
            } else {
              newDate.setMonth(currentDate.getMonth() + 1);
            }
          } else {
            return;
          }
          break;
      }

      // Update focused date and notify parent
      setFocusedDate(newDate);
      onNavigate(newDate, key, { ctrlKey, shiftKey, altKey });
    },
    [enabled, focusedDate, onNavigate, onSelect, onEscape, onEnter]
  );

  /**
   * Handle mouse events to update focus
   * @param {Date} date - Date that was clicked
   */
  const handleMouseFocus = useCallback((date) => {
    setFocusedDate(date);
    setIsNavigating(false);
  }, []);

  /**
   * Focus on a specific date programmatically
   * @param {Date} date - Date to focus on
   */
  const focusDate = useCallback((date) => {
    setFocusedDate(date);
    setIsNavigating(true);
  }, []);

  /**
   * Reset focus to today
   */
  const focusToday = useCallback(() => {
    const today = new Date();
    setFocusedDate(today);
    setIsNavigating(true);
    onNavigate(today, "programmatic");
  }, [onNavigate]);

  /**
   * Check if a date is currently focused
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is focused
   */
  const isDateFocused = useCallback(
    (date) => {
      return (
        focusedDate &&
        date.getDate() === focusedDate.getDate() &&
        date.getMonth() === focusedDate.getMonth() &&
        date.getFullYear() === focusedDate.getFullYear()
      );
    },
    [focusedDate]
  );

  /**
   * Get keyboard navigation instructions
   * @returns {Array} Array of instruction objects
   */
  const getKeyboardInstructions = useCallback(
    () => [
      { keys: ["Arrow Keys"], description: "Navigate between dates" },
      { keys: ["Ctrl + Arrow Keys"], description: "Navigate by weeks/months" },
      { keys: ["Enter", "Space"], description: "Select date" },
      { keys: ["Escape"], description: "Cancel selection" },
      { keys: ["Home"], description: "Go to first day of month" },
      { keys: ["End"], description: "Go to last day of month" },
      { keys: ["Page Up/Down"], description: "Navigate months" },
      { keys: ["Shift + Page Up/Down"], description: "Navigate years" },
    ],
    []
  );

  // Set up keyboard event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener("keydown", handleKeyDown);

    // Make container focusable
    if (!container.hasAttribute("tabIndex")) {
      container.setAttribute("tabIndex", "-1");
    }

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Focus container when navigation starts
  useEffect(() => {
    if (isNavigating && containerRef.current && enabled) {
      containerRef.current.focus();
    }
  }, [isNavigating, enabled]);

  // Clear navigation state after a delay
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  return {
    // State
    focusedDate,
    isNavigating,
    containerRef,

    // Methods
    handleMouseFocus,
    focusDate,
    focusToday,
    isDateFocused,
    getKeyboardInstructions,

    // Utilities
    setFocusedDate,
  };
};
