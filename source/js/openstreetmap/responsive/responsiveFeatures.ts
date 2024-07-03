import { mobile } from "./mobile";

class ResponsiveFeatures {
    constructor(container: HTMLElement, baseClass: string) {
        mobile(container, baseClass);
    }
}

export default ResponsiveFeatures;