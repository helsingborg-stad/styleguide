document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

const swipeUp = new CustomEvent('swipeUp', {
    bubbles: true,
});

const swipeDown = new CustomEvent('swipeDown', {
    bubbles: true,
});

const swipeRight = new CustomEvent('swipeRight', {
    bubbles: true,
});

const swipeLeft = new CustomEvent('swipeLeft', {
    bubbles: true,
});

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            evt.target.dispatchEvent(swipeLeft)
        } else {
            /* right swipe */
            evt.target.dispatchEvent(swipeRight)
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            evt.target.dispatchEvent(swipeUp)
        } else { 
            /* down swipe */
            evt.target.dispatchEvent(swipeDown)
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};
