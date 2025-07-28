/**
 * Animation System for Interactive Crypto Calendar
 * Provides smooth transitions and interactive animations
 */

// Animation configuration
export const ANIMATION_CONFIG = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750,
    slowest: 1000,
  },
  easings: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  delays: {
    none: 0,
    short: 50,
    medium: 100,
    long: 200,
  },
};

// Animation utility class
export class AnimationManager {
  constructor() {
    this.activeAnimations = new Map();
    this.observers = new Map();
    this.setupIntersectionObserver();
  }

  // Setup intersection observer for scroll-triggered animations
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const animationId = element.dataset.animationId;

          if (entry.isIntersecting) {
            this.triggerScrollAnimation(element, animationId);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );
  }

  // Register element for scroll animations
  observeElement(element, animationConfig) {
    const animationId = `scroll-${Date.now()}-${Math.random()}`;
    element.dataset.animationId = animationId;

    this.observers.set(animationId, animationConfig);
    this.intersectionObserver.observe(element);

    return animationId;
  }

  // Trigger scroll animation
  triggerScrollAnimation(element, animationId) {
    const config = this.observers.get(animationId);
    if (!config) return;

    this.animate(element, config.animation, config.options);
  }

  // Core animation method
  animate(element, animationType, options = {}) {
    if (!element) return Promise.resolve();

    const {
      duration = ANIMATION_CONFIG.durations.normal,
      easing = ANIMATION_CONFIG.easings.smooth,
      delay = ANIMATION_CONFIG.delays.none,
      fillMode = "both",
    } = options;

    const animationId = `anim-${Date.now()}-${Math.random()}`;

    return new Promise((resolve) => {
      const keyframes = this.getKeyframes(animationType, options);

      const animation = element.animate(keyframes, {
        duration,
        easing,
        delay,
        fill: fillMode,
      });

      this.activeAnimations.set(animationId, animation);

      animation.onfinish = () => {
        this.activeAnimations.delete(animationId);
        resolve();
      };

      animation.oncancel = () => {
        this.activeAnimations.delete(animationId);
        resolve();
      };
    });
  }

  // Get keyframes for different animation types
  getKeyframes(type, options) {
    switch (type) {
      case "fadeIn":
        return [{ opacity: 0 }, { opacity: 1 }];

      case "fadeOut":
        return [{ opacity: 1 }, { opacity: 0 }];

      case "slideInLeft":
        return [
          { transform: "translateX(-100%)", opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ];

      case "slideInRight":
        return [
          { transform: "translateX(100%)", opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ];

      case "slideInUp":
        return [
          { transform: "translateY(50px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ];

      case "slideInDown":
        return [
          { transform: "translateY(-50px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ];

      case "scaleIn":
        return [
          { transform: "scale(0.8)", opacity: 0 },
          { transform: "scale(1)", opacity: 1 },
        ];

      case "scaleOut":
        return [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(0.8)", opacity: 0 },
        ];

      case "bounce":
        return [
          {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
          },
          {
            transform: "translateY(-30px)",
            animationTimingFunction: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
          },
          {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
          },
          {
            transform: "translateY(-15px)",
            animationTimingFunction: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
          },
          { transform: "translateY(0)" },
        ];

      case "pulse":
        return [
          { transform: "scale(1)" },
          { transform: "scale(1.05)" },
          { transform: "scale(1)" },
        ];

      case "shake":
        return [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(0)" },
        ];

      case "flip":
        return [
          { transform: "perspective(400px) rotateY(0)" },
          { transform: "perspective(400px) rotateY(-180deg)" },
        ];

      case "flipIn":
        return [
          { transform: "perspective(400px) rotateY(-90deg)", opacity: 0 },
          { transform: "perspective(400px) rotateY(0deg)", opacity: 1 },
        ];

      case "zoomIn":
        return [
          { transform: "scale3d(0.3, 0.3, 0.3)", opacity: 0 },
          { transform: "scale3d(1, 1, 1)", opacity: 1 },
        ];

      case "rotateIn":
        return [
          { transform: "rotate(-200deg)", opacity: 0 },
          { transform: "rotate(0deg)", opacity: 1 },
        ];

      case "slideUpFade":
        return [
          { transform: "translateY(30px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ];

      case "colorPulse":
        const { fromColor = "#ffffff", toColor = "#4caf50" } = options;
        return [
          { backgroundColor: fromColor },
          { backgroundColor: toColor },
          { backgroundColor: fromColor },
        ];

      case "numberCountUp":
        const { from = 0, to = 100 } = options;
        const steps = 20;
        const keyframes = [];
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          const value = from + (to - from) * progress;
          keyframes.push({ "--number-value": value.toString() });
        }
        return keyframes;

      default:
        return [{ opacity: 1 }];
    }
  }

  // Stagger multiple elements
  async stagger(elements, animationType, options = {}) {
    const { staggerDelay = 100, ...animationOptions } = options;

    const promises = Array.from(elements).map((element, index) => {
      const delay = index * staggerDelay;
      return this.animate(element, animationType, {
        ...animationOptions,
        delay: delay + (animationOptions.delay || 0),
      });
    });

    return Promise.all(promises);
  }

  // Sequence multiple animations
  async sequence(animations) {
    for (const { element, type, options } of animations) {
      await this.animate(element, type, options);
    }
  }

  // Parallel animations
  async parallel(animations) {
    const promises = animations.map(({ element, type, options }) =>
      this.animate(element, type, options)
    );
    return Promise.all(promises);
  }

  // Cancel all animations
  cancelAll() {
    this.activeAnimations.forEach((animation) => animation.cancel());
    this.activeAnimations.clear();
  }

  // Cancel specific animation
  cancel(animationId) {
    const animation = this.activeAnimations.get(animationId);
    if (animation) {
      animation.cancel();
      this.activeAnimations.delete(animationId);
    }
  }

  // Cleanup
  destroy() {
    this.cancelAll();
    this.intersectionObserver.disconnect();
    this.observers.clear();
  }
}

// CSS Animations for complex effects
export const CSS_ANIMATIONS = {
  // Data visualization animations
  chartReveal: `
    @keyframes chartReveal {
      0% {
        clip-path: inset(0 100% 0 0);
      }
      100% {
        clip-path: inset(0 0 0 0);
      }
    }
    .chart-reveal {
      animation: chartReveal 1s ease-out forwards;
    }
  `,

  // Calendar cell animations
  calendarCellPulse: `
    @keyframes calendarCellPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
      }
    }
    .calendar-cell-pulse {
      animation: calendarCellPulse 2s infinite;
    }
  `,

  // Loading animations
  skeletonLoading: `
    @keyframes skeletonLoading {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
    .skeleton-loading {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200px 100%;
      animation: skeletonLoading 1.5s infinite;
    }
  `,

  // Number counting animation
  numberCountUp: `
    @keyframes numberCountUp {
      from {
        --number-value: 0;
      }
    }
    .number-count-up {
      animation: numberCountUp 1s ease-out forwards;
    }
    .number-count-up::after {
      content: counter(number-counter);
      counter-increment: number-counter var(--number-value);
    }
  `,

  // Floating elements
  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    .float {
      animation: float 3s ease-in-out infinite;
    }
  `,

  // Glow effect
  glow: `
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
      }
    }
    .glow {
      animation: glow 2s ease-in-out infinite;
    }
  `,

  // Progress bar animation
  progressFill: `
    @keyframes progressFill {
      0% {
        width: 0%;
      }
    }
    .progress-fill {
      animation: progressFill 1s ease-out forwards;
    }
  `,

  // Typewriter effect
  typewriter: `
    @keyframes typewriter {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }
    @keyframes blinkCursor {
      from, to {
        border-color: transparent;
      }
      50% {
        border-color: currentColor;
      }
    }
    .typewriter {
      overflow: hidden;
      border-right: 2px solid;
      white-space: nowrap;
      animation: typewriter 2s steps(40, end), blinkCursor 0.75s step-end infinite;
    }
  `,
};

// Inject CSS animations into the document
export const injectCSS = (css) => {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = css;
  document.head.appendChild(styleSheet);
  return styleSheet;
};

// Initialize all CSS animations
export const initializeAnimations = () => {
  const allCSS = Object.values(CSS_ANIMATIONS).join("\n");
  return injectCSS(allCSS);
};

// Create singleton animation manager
export const animationManager = new AnimationManager();

// React Hook for animations
export const useAnimation = () => {
  const animate = (element, type, options) => {
    return animationManager.animate(element, type, options);
  };

  const stagger = (elements, type, options) => {
    return animationManager.stagger(elements, type, options);
  };

  const sequence = (animations) => {
    return animationManager.sequence(animations);
  };

  const parallel = (animations) => {
    return animationManager.parallel(animations);
  };

  return {
    animate,
    stagger,
    sequence,
    parallel,
    manager: animationManager,
  };
};

// Predefined animation combinations for common UI patterns
export const UI_ANIMATIONS = {
  // Dashboard panel entrance
  dashboardEntrance: {
    type: "slideUpFade",
    options: {
      duration: ANIMATION_CONFIG.durations.slow,
      easing: ANIMATION_CONFIG.easings.smooth,
    },
  },

  // Calendar cell hover
  calendarCellHover: {
    type: "scaleIn",
    options: {
      duration: ANIMATION_CONFIG.durations.fast,
      easing: ANIMATION_CONFIG.easings.bounce,
    },
  },

  // Chart data update
  chartUpdate: {
    type: "fadeIn",
    options: {
      duration: ANIMATION_CONFIG.durations.normal,
      easing: ANIMATION_CONFIG.easings.smooth,
    },
  },

  // Alert notification
  alertNotification: {
    type: "slideInRight",
    options: {
      duration: ANIMATION_CONFIG.durations.normal,
      easing: ANIMATION_CONFIG.easings.elastic,
    },
  },

  // Loading state
  loadingPulse: {
    type: "pulse",
    options: {
      duration: ANIMATION_CONFIG.durations.slow,
      easing: ANIMATION_CONFIG.easings.ease,
    },
  },
};

// Utility functions
export const createStaggeredEntrance = async (elements, delay = 100) => {
  return animationManager.stagger(elements, "slideUpFade", {
    staggerDelay: delay,
    duration: ANIMATION_CONFIG.durations.normal,
    easing: ANIMATION_CONFIG.easings.smooth,
  });
};

export const createPageTransition = async (exitElement, enterElement) => {
  await animationManager.parallel([
    { element: exitElement, type: "fadeOut", options: { duration: 200 } },
    {
      element: enterElement,
      type: "fadeIn",
      options: { duration: 200, delay: 100 },
    },
  ]);
};

export const animateNumberChange = async (element, from, to) => {
  return animationManager.animate(element, "numberCountUp", {
    from,
    to,
    duration: ANIMATION_CONFIG.durations.slow,
    easing: ANIMATION_CONFIG.easings.smooth,
  });
};

export default animationManager;
