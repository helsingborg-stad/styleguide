
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.LocalStorageReferer = (function ($) {
    
    var refUrlStorageHistory;
    
    /**
     * Create Local Storage.
     * @author Johan Silvergrund
     * @constructor
     * @this {LocalStorageReferer}
     */
    function LocalStorageReferer() {
        if (typeof(Storage) !== 'undefined') {
            this.setStorage(); 
        }    
    };


    /**
     * Fetches url parameter
     * @author Johan Silvergrund
     * @this {getUrlParameter}
     * @param string sParam
     */
    LocalStorageReferer.prototype.getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    
    /**
     * Check local storage
     * @author Johan Silvergrund
     * @this {checkStorage}
     * @param {string} storageType
     * @return {string} url
     */
    LocalStorageReferer.prototype.checkStorage = function(storageType) {
        return localStorage.getItem(storageType);
    };    
    

    /**
     * Creates a Local storage
     * @author Johan Silvergrund
     * @this {setStorage}
     */
    LocalStorageReferer.prototype.setStorage = function() {
        var storeHistory = this.checkStorage('refUrlStorage');
        if (storeHistory != window.location.href) {
            if (this.getUrlParameter('modularityForm')) {
                refUrlStorageHistory = localStorage.setItem('refUrlStorageHistory', decodeURIComponent(this.getUrlParameter('modularityForm')));
                refUrlStorage = localStorage.setItem('refUrlStorageHistory', decodeURIComponent(this.getUrlParameter('modularityReferrer')));
            }
            else {
                refUrlStorageHistory = localStorage.setItem('refUrlStorageHistory', storeHistory );
                refUrlStorage = localStorage.setItem('refUrlStorage', window.location.href );
            }     
        }    
        
        this.addStorageRefererToDoom();      
    };
    

    /**
     * Adding referer URL to doom
     * @author Johan Silvergrund
     * @this {addStorageRefererToDoom}
     */
    LocalStorageReferer.prototype.addStorageRefererToDoom = function() {
        if ($('#modularity-form-history').length !== 0) {
            $('#modularity-form-history').val(this.checkStorage('refUrlStorageHistory'));
            $('#modularity-form-url').val(this.checkStorage('refUrlStorage'));
        } 
    };    

    return new LocalStorageReferer();

})(jQuery);