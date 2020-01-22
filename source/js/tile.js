import Masonry from 'masonry-layout';

export default class Tiles {
    constructor() {
        this.itemSelector = '.c-tile__item';
        this.tileSizer = '.c-tile__sizer';
        this.containerSelector = '.c-tile__container';
    }

    initTiles () {
        const msnry = new Masonry( this.containerSelector, {
            columnWidth: this.tileSizer,
            itemSelector: this.itemSelector
        });
    }
}