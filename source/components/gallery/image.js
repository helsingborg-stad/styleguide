/**
 * Component Image
 */
export function setImageDimensions(image, src, width, height) {
	let dimensions = Number(width) > 0 && Number(height) > 0 ? [Number(width), Number(height)] : null;
	if (!dimensions && src) {
		const path = new URL(src, document.baseURI).pathname;
		const match = path.match(/(\d{2,5})x(\d{2,5})(?:\D|$)/) || path.match(/\/(\d{2,5})\/(\d{2,5})\/?$/);
		if (match) {
			dimensions = [Number(match[1]), Number(match[2])];
		}
	}

	if (dimensions) {
		image.setAttribute('width', String(dimensions[0]));
		image.setAttribute('height', String(dimensions[1]));
	} else {
		image.removeAttribute('width');
		image.removeAttribute('height');
	}
}

class Image {
	constructor() {
		this.image = null;
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
		this.image = document.createElement('img');

		this.appendImage();
	}

	/**
	 * Setting Image Attributes
	 * @return void
	 */
	setAttr() {
		if (this.imgAttr.src) {
			for (const [key, value] of Object.entries(this.imgAttr)) {
				this.image.setAttribute(`${key}`, value);
			}
		}
		setImageDimensions(this.image, this.imgAttr.src, this.imgAttr.width, this.imgAttr.height);
		this.image.addEventListener('load', () => {
			if (!this.imgAttr.width || !this.imgAttr.height) {
				setImageDimensions(this.image, this.image.currentSrc || this.image.src, this.image.naturalWidth, this.image.naturalHeight);
			}
		});
	}

	/**
	 * Adding CSS classes
	 * @return void
	 */
	setCSSClasses() {
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
