class DismissableNotice {
  private notice: HTMLElement;
  private dismissTrigger: HTMLElement | null;
  private uid: string;
  private timeout: string;

  constructor(notice: HTMLElement) {
    this.notice = notice;
    this.dismissTrigger = this.notice.querySelector('[data-dismissable-notice-trigger="1"]');
    this.uid = this.notice.getAttribute('data-dismissable-notice-uid') || '';
    this.timeout = this.notice.getAttribute('data-dismissable-notice-timeout') || 'session';

    this.init();
  }

  /**
   * Initializes the dismissable notice by setting up event listeners
   * and checking if the notice should be displayed.
   */
  private init() {
    if (!this.shouldShowNotice()) {
      this.notice.remove();
      return;
    }

    this.setupListeners();
  }

  /**
   * Sets up the event listener for the dismiss button.
   */
  private setupListeners() {
    if (this.dismissTrigger) {
      this.dismissTrigger.addEventListener('click', () => this.dismiss());
    }
  }

  /**
   * Checks if the notice should be shown based on its timeout value
   * and the stored state in sessionStorage or localStorage.
   */
  private shouldShowNotice(): boolean {
    const storage = this.getStorage();
    return !storage.getItem(this.uid);
  }

  /**
   * Dismisses the notice by storing its state in sessionStorage or localStorage
   * and removing it from the DOM.
   */
  private dismiss() {
    const storage = this.getStorage();
    storage.setItem(this.uid, 'dismissed');
    this.notice.remove();
  }

  /**
   * Returns the appropriate storage object (sessionStorage or localStorage)
   * based on the timeout value.
   */
  private getStorage(): Storage {
    switch (this.timeout) {
      case 'permanent':
        return localStorage;
      case 'session':
      default:
        return sessionStorage;
    }
  }
}

/**
 * Initializes all dismissable notices on the page.
 */
export function initializeDismissableNotices() {
  document.querySelectorAll<HTMLElement>('[data-dismissable-notice="1"]').forEach(notice => {
    new DismissableNotice(notice);
  });
}

// Initialize dismissable notices on DOM content loaded
document.addEventListener('DOMContentLoaded', () => initializeDismissableNotices());