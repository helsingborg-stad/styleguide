"use strict";

const rippleObject = document.querySelectorAll(".ripple");

rippleObject.forEach(link => link.addEventListener("click", function(e) {

    //Remove previous animation (if running)
    this.classList.remove("ripple--is-animating");

    //Get bounding element
    const rect = this.getBoundingClientRect(); 

    //Get size
    const size = Math.max(this.offsetHeight, this.offsetWidth);

    //Set the css sizes
    this.style.setProperty('--pos-x', (e.clientY - rect.y - size/2) + "px");
    this.style.setProperty('--pos-y', (e.clientX - rect.x - size/2) + "px");
    this.style.setProperty('--size', size + "px");

    //Animate
    this.classList.add("ripple--is-animating");
}));