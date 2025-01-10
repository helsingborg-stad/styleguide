enum NoticeTimeout {
  Session = 'session',
  Permanent = 'permanent',
  Immediate = 'immediate',
}

class DismissableNotice {
  private notice: HTMLElement;
  private dismissTrigger: HTMLElement | null;
  private uid: string;
  private timeout: NoticeTimeout;

  constructor(notice: HTMLElement) {
      this.notice         = notice;
      this.dismissTrigger = this.notice.querySelector('[data-dismissable-notice-trigger]');
      this.uid            = this.notice.getAttribute('data-dismissable-notice-uid') || '';
      this.timeout        = this.uid ? this.getTimeoutValue() : NoticeTimeout.Immediate;

      this.init();
  }

  /**
   * Initializes the dismissable notice by setting up event listeners
   * and checking if the notice should be displayed.
   */
  private init(): void {
      if (this.timeout !== NoticeTimeout.Immediate && !this.shouldShowNotice()) {
          this.removeNotice();
          return;
      }

      this.setupListeners();
  }

  /**
   * Sets up the event listener for the dismiss button.
   */
  private setupListeners(): void {
      if (this.dismissTrigger) {
          this.dismissTrigger.addEventListener('click', () => this.dismiss(), { once: true });
      }
  }

  /**
   * Checks if the notice should be shown based on its timeout value
   * and the stored state in sessionStorage or localStorage.
   */
  private shouldShowNotice(): boolean {
      const storage = this.getStorage();
      return this.timeout === NoticeTimeout.Immediate || !storage.getItem(this.uid);
  }

  /**
   * Dismisses the notice by storing its state in sessionStorage or localStorage
   * and removing it from the DOM.
   */
  private dismiss(): void {
      if (this.timeout !== NoticeTimeout.Immediate && this.uid) {
          const storage = this.getStorage();
          storage.setItem(this.uid, 'dismissed');
      }
      this.removeNotice();
  }

  /**
   * Removes the notice from the DOM.
   */
  private removeNotice(): void {
      this.notice.remove();
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
export function initializeDismissableNotices(): void {
  const notices = document.querySelectorAll<HTMLElement>('[data-dismissable-notice]');
  notices.forEach((notice) => {
      new DismissableNotice(notice);
  });
}

export default initializeDismissableNotices;