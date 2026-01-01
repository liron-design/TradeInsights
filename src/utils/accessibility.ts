// Advanced accessibility utilities for WCAG 2.1 AA compliance
export class AccessibilityUtils {
  private static announceRegion: HTMLElement | null = null;
  private static focusHistory: HTMLElement[] = [];

  // Initialize accessibility features
  static init(): void {
    this.announceRegion = this.createLiveRegion('accessibility-announcer', 'polite');
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.addSkipLinks();
  }

  // Focus management with history
  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store current focus for restoration
    const previousFocus = document.activeElement as HTMLElement;
    this.focusHistory.push(previousFocus);
    
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
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.restoreFocus();
        e.preventDefault();
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    element.addEventListener('keydown', handleEscapeKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
      element.removeEventListener('keydown', handleEscapeKey);
      this.restoreFocus();
    };
  }

  static restoreFocus(): void {
    const previousFocus = this.focusHistory.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  // Announce to screen readers with priority levels
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announceRegion) {
      this.createLiveRegion();
    }
    
    if (this.announceRegion) {
      this.announceRegion.setAttribute('aria-live', priority);
      this.announceRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.announceRegion) {
          this.announceRegion.textContent = '';
        }
      }, 1000);
    }
  }

  // Color contrast validation with WCAG standards
  static validateContrast(foreground: string, background: string): { 
    ratio: number; 
    isValid: boolean; 
    level: 'AA' | 'AAA' | 'fail';
    recommendation?: string;
  } {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);
    
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    let level: 'AA' | 'AAA' | 'fail' = 'fail';
    let recommendation = '';
    
    if (ratio >= 7) {
      level = 'AAA';
    } else if (ratio >= 4.5) {
      level = 'AA';
    } else {
      level = 'fail';
      recommendation = ratio >= 3 ? 'Consider darker text or lighter background' : 'Significant contrast improvement needed';
    }
    
    return {
      ratio: Number(ratio.toFixed(2)),
      isValid: ratio >= 4.5,
      level,
      recommendation
    };
  }

  private static getLuminance(color: string): number {
    // Convert hex to RGB
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  // Advanced keyboard navigation
  static addKeyboardNavigation(element: HTMLElement, options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
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
        case 'Home':
          e.preventDefault();
          options.onHome?.();
          break;
        case 'End':
          e.preventDefault();
          options.onEnd?.();
          break;
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  // ARIA label generation with context awareness
  static generateAriaLabel(element: {
    type: 'button' | 'link' | 'input' | 'chart' | 'table' | 'dialog' | 'menu';
    action?: string;
    value?: string | number;
    context?: string;
    state?: 'expanded' | 'collapsed' | 'selected' | 'disabled';
    position?: { current: number; total: number };
  }): string {
    const { type, action, value, context, state, position } = element;
    
    let label = '';
    
    switch (type) {
      case 'button':
        label = action ? `${action} button` : 'Button';
        if (state === 'disabled') label += ', disabled';
        break;
      case 'link':
        label = action ? `${action} link` : 'Link';
        break;
      case 'input':
        label = context ? `${context} input` : 'Input field';
        if (value !== undefined) label += `, current value: ${value}`;
        break;
      case 'chart':
        label = context ? `${context} chart` : 'Chart';
        break;
      case 'table':
        label = context ? `${context} table` : 'Data table';
        break;
      case 'dialog':
        label = context ? `${context} dialog` : 'Dialog';
        break;
      case 'menu':
        label = context ? `${context} menu` : 'Menu';
        if (state === 'expanded') label += ', expanded';
        else if (state === 'collapsed') label += ', collapsed';
        break;
    }
    
    if (position) {
      label += `, ${position.current} of ${position.total}`;
    }
    
    return label;
  }

  // Screen reader optimizations with role management
  static optimizeForScreenReaders(element: HTMLElement, options: {
    role?: string;
    label?: string;
    description?: string;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
    level?: number;
    setSize?: number;
    posInSet?: number;
  }): void {
    const { role, label, description, expanded, selected, disabled, level, setSize, posInSet } = options;
    
    if (role) element.setAttribute('role', role);
    if (label) element.setAttribute('aria-label', label);
    if (description) element.setAttribute('aria-describedby', description);
    if (expanded !== undefined) element.setAttribute('aria-expanded', expanded.toString());
    if (selected !== undefined) element.setAttribute('aria-selected', selected.toString());
    if (disabled !== undefined) element.setAttribute('aria-disabled', disabled.toString());
    if (level !== undefined) element.setAttribute('aria-level', level.toString());
    if (setSize !== undefined) element.setAttribute('aria-setsize', setSize.toString());
    if (posInSet !== undefined) element.setAttribute('aria-posinset', posInSet.toString());
    
    // Ensure focusable elements have proper tabindex
    if (['button', 'link'].includes(element.tagName.toLowerCase()) && !element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  }

  // Reduced motion detection and handling
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static respectMotionPreferences(element: HTMLElement): void {
    if (this.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }
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

  // Skip link implementation with multiple targets
  static addSkipLinks(): void {
    const skipLinks = [
      { targetId: 'main-content', text: 'Skip to main content' },
      { targetId: 'navigation', text: 'Skip to navigation' },
      { targetId: 'search', text: 'Skip to search' }
    ];

    const container = document.createElement('div');
    container.className = 'skip-links';
    
    skipLinks.forEach(({ targetId, text }) => {
      const skipLink = document.createElement('a');
      skipLink.href = `#${targetId}`;
      skipLink.textContent = text;
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50';
      
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
          this.announce(`Navigated to ${text.toLowerCase()}`);
        }
      });
      
      container.appendChild(skipLink);
    });
    
    document.body.insertBefore(container, document.body.firstChild);
  }

  // Live region management with multiple regions
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

  // Update live region with debouncing
  static updateLiveRegion(id: string, message: string, delay: number = 100): void {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      // Debounce updates to prevent spam
      clearTimeout((liveRegion as any).updateTimeout);
      (liveRegion as any).updateTimeout = setTimeout(() => {
        liveRegion.textContent = message;
      }, delay);
    }
  }

  // Landmark navigation with ARIA roles
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

    // Add landmark navigation shortcuts
    this.addLandmarkShortcuts();
  }

  private static addLandmarkShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Alt + number keys for landmark navigation
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const landmarkIndex = parseInt(e.key) - 1;
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
        const target = landmarks[landmarkIndex] as HTMLElement;
        
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
          const role = target.getAttribute('role');
          this.announce(`Navigated to ${role} landmark`);
        }
      }
    });
  }

  // Error message association with enhanced feedback
  static associateErrorMessage(inputId: string, errorId: string, errorMessage: string): void {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (input && errorElement) {
      input.setAttribute('aria-describedby', errorId);
      input.setAttribute('aria-invalid', 'true');
      errorElement.setAttribute('role', 'alert');
      errorElement.textContent = errorMessage;
      
      // Announce error to screen readers
      this.announce(`Error in ${input.getAttribute('aria-label') || 'input field'}: ${errorMessage}`, 'assertive');
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

  // Table accessibility enhancements
  static enhanceTableAccessibility(table: HTMLTableElement): void {
    // Add table caption if missing
    if (!table.caption) {
      const caption = document.createElement('caption');
      caption.textContent = 'Market data table';
      caption.className = 'sr-only';
      table.appendChild(caption);
    }

    // Enhance headers
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (!header.id) {
        header.id = `table-header-${index}`;
      }
      header.setAttribute('scope', 'col');
    });

    // Associate cells with headers
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const header = headers[cellIndex];
        if (header) {
          cell.setAttribute('headers', header.id);
        }
      });
    });
  }

  // Form accessibility enhancements
  static enhanceFormAccessibility(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
      const inputElement = input as HTMLInputElement;
      
      // Ensure proper labeling
      if (!inputElement.getAttribute('aria-label') && !inputElement.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${inputElement.id}"]`);
        if (label) {
          inputElement.setAttribute('aria-labelledby', label.id || `label-${index}`);
          if (!label.id) label.id = `label-${index}`;
        }
      }
      
      // Add required indicator
      if (inputElement.required) {
        inputElement.setAttribute('aria-required', 'true');
      }
      
      // Enhance error handling
      const errorElement = form.querySelector(`[data-error-for="${inputElement.id}"]`);
      if (errorElement) {
        this.associateErrorMessage(inputElement.id, errorElement.id, '');
      }
    });
  }

  // Chart accessibility with data tables
  static makeChartAccessible(chartContainer: HTMLElement, data: any[], title: string): void {
    // Add chart title
    if (!chartContainer.getAttribute('aria-label')) {
      chartContainer.setAttribute('aria-label', title);
    }
    
    // Create data table alternative
    const tableId = `${chartContainer.id}-data-table`;
    let dataTable = document.getElementById(tableId);
    
    if (!dataTable) {
      dataTable = document.createElement('table');
      dataTable.id = tableId;
      dataTable.className = 'sr-only';
      
      // Create table structure
      const caption = document.createElement('caption');
      caption.textContent = `Data table for ${title}`;
      dataTable.appendChild(caption);
      
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      
      if (data.length > 0) {
        // Create headers
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
          const th = document.createElement('th');
          th.textContent = key;
          th.setAttribute('scope', 'col');
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        
        // Create data rows
        data.forEach(item => {
          const row = document.createElement('tr');
          Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = String(value);
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
      }
      
      dataTable.appendChild(thead);
      dataTable.appendChild(tbody);
      chartContainer.appendChild(dataTable);
    }
    
    // Link chart to data table
    chartContainer.setAttribute('aria-describedby', tableId);
  }

  // Setup global keyboard navigation
  private static setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '/':
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              this.announce('Search focused');
            }
            break;
          case 'k':
            e.preventDefault();
            // Focus on main navigation
            const nav = document.querySelector('[role="navigation"]') as HTMLElement;
            if (nav) {
              nav.focus();
              this.announce('Navigation focused');
            }
            break;
        }
      }
    });
  }

  // Setup focus management
  private static setupFocusManagement(): void {
    // Track focus for debugging
    if (process.env.NODE_ENV === 'development') {
      document.addEventListener('focusin', (e) => {
        const target = e.target as HTMLElement;
        console.log('Focus:', target.tagName, target.className, target.getAttribute('aria-label'));
      });
    }
    
    // Ensure focus is always visible
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Accessibility audit
  static performAccessibilityAudit(): {
    score: number;
    issues: Array<{ severity: 'low' | 'medium' | 'high'; description: string; recommendation: string }>;
  } {
    const issues: Array<{ severity: 'low' | 'medium' | 'high'; description: string; recommendation: string }> = [];
    let score = 100;

    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push({
        severity: 'high',
        description: `${images.length} images missing alt text`,
        recommendation: 'Add descriptive alt text to all images'
      });
      score -= 20;
    }

    // Check for missing form labels
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    if (unlabeledInputs.length > 0) {
      issues.push({
        severity: 'high',
        description: `${unlabeledInputs.length} form inputs missing labels`,
        recommendation: 'Associate all form inputs with labels'
      });
      score -= 15;
    }

    // Check for missing headings structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.push({
        severity: 'medium',
        description: 'No heading structure found',
        recommendation: 'Add proper heading hierarchy'
      });
      score -= 10;
    }

    // Check for missing landmarks
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"]');
    if (landmarks.length < 2) {
      issues.push({
        severity: 'medium',
        description: 'Insufficient landmark regions',
        recommendation: 'Add proper landmark roles (main, navigation, banner)'
      });
      score -= 10;
    }

    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    let keyboardInaccessible = 0;
    
    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && element.tagName !== 'DIV') {
        keyboardInaccessible++;
      }
    });
    
    if (keyboardInaccessible > 0) {
      issues.push({
        severity: 'high',
        description: `${keyboardInaccessible} interactive elements not keyboard accessible`,
        recommendation: 'Ensure all interactive elements are keyboard accessible'
      });
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  // Cleanup function
  static cleanup(): void {
    if (this.announceRegion && document.contains(this.announceRegion)) {
      document.body.removeChild(this.announceRegion);
      this.announceRegion = null;
    }
    this.focusHistory = [];
  }
}