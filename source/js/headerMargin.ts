/** Creates a css var, to indicate a dynamic header margin */
import { debounce } from './utils/debounce';

export class HeaderMarginManager {
  private readonly root: HTMLElement;
  private readonly header: HTMLElement | null;

  constructor() {
    this.root = document.documentElement;
    this.header = document.querySelector<HTMLElement>('#site-header');

    if (this.header?.classList.contains('c-header--sticky')) {
      this.applyMargin();
      this.addResizeListener();
    }
  }

  private applyMargin() {
    if (!this.header) return;
    const marginValue = `${this.header.offsetHeight + 20}px`;
    this.root.style.setProperty('--dynamic-header-margin', marginValue);
  }

  private addResizeListener() {
    window.addEventListener('resize', debounce(() => this.applyMargin(), 2000));
  }
}