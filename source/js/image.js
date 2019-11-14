/**
 * Component Image
 */
class Image {

    constructor() {

        this.imgElement = null;
        this.container = null;
        this.imgAttr = null;
        this.imgCss = null;
    }

    /**
     * Init
     * @return void
     */
    initImage(imageData) {

        this.container = imageData.elementContainer;
        this.imgAttr = imageData.attrList;
        this.imgCss = imageData.classList;
        this.image = document.createElement("img");

        this.appendImage();
    }

    /**
     * Setting Image Attributes
     * @return void
     */
    setAttr(){

        if (this.imgAttr.src) {
            for (let [key, value] of Object.entries(this.imgAttr)) {
                this.image.setAttribute(`${key}`, value);
            }
        }
    }

    /**
     * Adding CSS classes
     * @return void
     */
    setCSSClasses(){

        if (this.imgCss.length > 0) {
            for (const cssClass of this.imgCss) {
                this.image.classList.add(cssClass);
            }
        }
    }

    /**
     * Append image to container
     * @param img
     */
    appendImage() {

        this.setAttr();
        this.container.appendChild(this.image);
        this.setCSSClasses();
    }
}

export default Image;