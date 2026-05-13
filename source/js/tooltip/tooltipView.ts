import { TooltipAttribute, TooltipClassName, TooltipStyleProperty } from './tooltipEnums';
import type { TooltipPosition, TooltipViewInterface } from './tooltipInterfaces';

class TooltipView implements TooltipViewInterface {
    public readonly element: HTMLDivElement;
    public readonly id: string;

    constructor(id: string) {
        this.id = id;
        this.element = this.createTooltip();
    }

    public show(content: string): void {
        this.element.textContent = content;
        this.element.style.visibility = 'hidden';
        this.element.classList.remove(TooltipClassName.Visible);
        this.element.setAttribute(TooltipAttribute.AriaHidden, 'false');
    }

    public reveal(): void {
        this.element.style.visibility = '';
        this.element.classList.add(TooltipClassName.Visible);
    }

    public hide(): void {
        this.element.classList.remove(TooltipClassName.Visible);
        this.element.setAttribute(TooltipAttribute.AriaHidden, 'true');
        this.element.style.visibility = '';
        this.element.textContent = '';
        this.element.style.removeProperty(TooltipStyleProperty.X);
        this.element.style.removeProperty(TooltipStyleProperty.Y);
        this.element.style.removeProperty(TooltipStyleProperty.ArrowLeft);
    }

    public setPosition(position: TooltipPosition): void {
        this.element.style.setProperty(TooltipStyleProperty.X, `${position.left}px`);
        this.element.style.setProperty(TooltipStyleProperty.Y, `${position.top}px`);
        this.element.style.setProperty(TooltipStyleProperty.ArrowLeft, `${position.arrowLeft}px`);
    }

    public isVisible(): boolean {
        return this.element.getAttribute(TooltipAttribute.AriaHidden) === 'false';
    }

    private createTooltip(): HTMLDivElement {
        const existingTooltip = document.getElementById(this.id) as HTMLDivElement | null;

        if (existingTooltip) {
            return existingTooltip;
        }

        const element = document.createElement('div');
        element.id = this.id;
        element.className = TooltipClassName.Root;
        element.setAttribute(TooltipAttribute.Role, 'tooltip');
        element.setAttribute(TooltipAttribute.AriaHidden, 'true');
        document.body.appendChild(element);

        return element;
    }
}

export default TooltipView;