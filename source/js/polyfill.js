if ("NodeList" in window && !NodeList.prototype.forEach) {
    console.info("polyfill for IE11");
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;

        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, "forEach", {
        value: function(callback, thisArg) {
            if (this == null) {
                throw new TypeError("Not an object");
            }

            thisArg = thisArg || window;
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                callback.call(thisArg, this[key], key, this);
                }
            }
        }
    });
}
