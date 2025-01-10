enum NoticeTimeout {
  Session = 'session',
  Permanent = 'permanent',
  Imidiate = 'imidiate',
}

class DismissableNotice {
  private notice: HTMLElement;
  private dismissTrigger: HTMLElement | null;
  private uid: string;
  private timeout: NoticeTimeout;

  constructor(notice: HTMLElement) {
      this.notice = notice;
      this.dismissTrigger = this.notice.querySelector('[data-dismissable-notice-trigger="1"]');
      this.uid = this.notice.getAttribute('data-dismissable-notice-uid') || '';
      this.timeout = this.getTimeoutValue();

      // If the notice has no UID and is not set to be dismissed immediately,
      if (!this.uid && this.timeout !== NoticeTimeout.Imidiate) {
          return;
      }

      this.init();
  }

  /**
   * Initializes the dismissable notice by setting up event listeners
   * and checking if the notice should be displayed.
   */
  private init() {
      if (this.timeout !== NoticeTimeout.Imidiate && !this.shouldShowNotice()) {
          this.removeNotice();
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
      return this.timeout === NoticeTimeout.Imidiate || !storage.getItem(this.uid);
  }

  /**
   * Dismisses the notice by storing its state in sessionStorage or localStorage
   * and removing it from the DOM.
   */
  private dismiss() {
      if (this.timeout !== NoticeTimeout.Imidiate) {
          const storage = this.getStorage();
          storage.setItem(this.uid, 'dismissed');
      }
      this.removeNotice();
  }

  /**
   * Removes the notice from the DOM.
   */
  private removeNotice() {
      this.notice.parentElement?.removeChild(this.notice);
  }

  /**
   * Returns the appropriate storage object (sessionStorage or localStorage)
   * based on the timeout value.
   */
  private getStorage(): Storage {
      switch (this.timeout) {
          case NoticeTimeout.Permanent:
              return localStorage;
          case NoticeTimeout.Session:
          default:
              return sessionStorage;
      }
  }

  /**
   * Retrieves and validates the timeout value from the data attribute.
   */
  private getTimeoutValue(): NoticeTimeout {
      const timeout = this.notice.getAttribute('data-dismissable-notice-timeout') as NoticeTimeout;
      if (Object.values(NoticeTimeout).includes(timeout)) {
          return timeout;
      }
      return NoticeTimeout.Session;
  }
}

/**
* Initializes all dismissable notices on the page.
*/
export function initializeDismissableNotices() {
  const notices = document.querySelectorAll<HTMLElement>('[data-dismissable-notice="1"]');
  notices.forEach((notice) => {
      new DismissableNotice(notice);
  });
}

export default initializeDismissableNotices;