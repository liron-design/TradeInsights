// Advanced accessibility utilities for WCAG 2.1 AA compliance
export class AccessibilityUtils {
  // Focus management
  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  // Announce to screen readers
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  // Color contrast validation
  static validateContrast(foreground: string, background: string): { ratio: number; isValid: boolean; level: 'AA' | 'AAA' | 'fail' } {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);
    
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    let level: 'AA' | 'AAA' | 'fail' = 'fail';
    if (ratio >= 7) level = 'AAA';
    else if (ratio >= 4.5) level = 'AA';
    
    return {
      ratio: Number(ratio.toFixed(2)),
      isValid: ratio >= 4.5,
      level
    };
  }

  private static getLuminance(color: string): number {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  // Keyboard navigation helpers
  static addKeyboardNavigation(element: HTMLElement, options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          options.onEnter?.();
          break;
        case ' ':
          e.preventDefault();
          options.onSpace?.();
          break;
        case 'Escape':
          options.onEscape?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          options.onArrowRight?.();
          break;
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  // ARIA label generation
  static generateAriaLabel(element: {
    type: 'button' | 'link' | 'input' | 'chart' | 'table';
    action?: string;
    value?: string | number;
    context?: string;
  }): string {
    const { type, action, value, context } = element;
    
    let label = '';
    
    switch (type) {
      case 'button':
        label = action ? `${action} button` : 'Button';
        break;
      case 'link':
        label = action ? `${action} link` : 'Link';
        break;
      case 'input':
        label = context ? `${context} input` : 'Input field';
        if (value) label += `, current value: ${value}`;
        break;
      case 'chart':
        label = context ? `${context} chart` : 'Chart';
        break;
      case 'table':
        label = context ? `${context} table` : 'Data table';
        break;
    }
    
    return label;
  }

  // Screen reader optimizations
  static optimizeForScreenReaders(element: HTMLElement, options: {
    role?: string;
    label?: string;
    description?: string;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
  }): void {
    const { role, label, description, expanded, selected, disabled } = options;
    
    if (role) element.setAttribute('role', role);
    if (label) element.setAttribute('aria-label', label);
    if (description) element.setAttribute('aria-describedby', description);
    if (expanded !== undefined) element.setAttribute('aria-expanded', expanded.toString());
    if (selected !== undefined) element.setAttribute('aria-selected', selected.toString());
    if (disabled !== undefined) element.setAttribute('aria-disabled', disabled.toString());
    
    // Ensure focusable elements have proper tabindex
    if (['button', 'link'].includes(element.tagName.toLowerCase()) && !element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  }

  // Reduced motion detection
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // High contrast detection
  static prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  // Font size preferences
  static getPreferredFontSize(): number {
    const testElement = document.createElement('div');
    testElement.style.fontSize = '1rem';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    const computedSize = window.getComputedStyle(testElement).fontSize;
    const size = parseFloat(computedSize);
    
    document.body.removeChild(testElement);
    
    return size;
  }

  // Skip link implementation
  static addSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50';
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    return skipLink;
  }

  // Live region management
  static createLiveRegion(id: string, priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
    let liveRegion = document.getElementById(id);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = id;
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
  }

  // Update live region
  static updateLiveRegion(id: string, message: string): void {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  // Landmark navigation
  static addLandmarkNavigation(): void {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
    
    landmarks.forEach((landmark, index) => {
      if (!landmark.hasAttribute('tabindex')) {
        landmark.setAttribute('tabindex', '-1');
      }
      
      if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        const role = landmark.getAttribute('role');
        landmark.setAttribute('aria-label', `${role} landmark ${index + 1}`);
      }
    });
  }

  // Error message association
  static associateErrorMessage(inputId: string, errorId: string, errorMessage: string): void {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (input && errorElement) {
      input.setAttribute('aria-describedby', errorId);
      input.setAttribute('aria-invalid', 'true');
      errorElement.setAttribute('role', 'alert');
      errorElement.textContent = errorMessage;
    }
  }

  // Clear error association
  static clearErrorAssociation(inputId: string, errorId: string): void {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (input) {
      input.removeAttribute('aria-describedby');
      input.removeAttribute('aria-invalid');
    }
    
    if (errorElement) {
      errorElement.removeAttribute('role');
      errorElement.textContent = '';
    }
  }
}