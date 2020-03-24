module.exports.sassTemplate = `
        
        // ***************************************************************
        // *** Settings
        // ***************************************************************
        @import "material/material-icons";
        @import "../../setting/variables";
        
        // ***************************************************************
        // *** Functions
        // ***************************************************************
        @import "../../function/strip-unit";
        @import "../../function/em";
        @import "../../function/rem";
        @import "../../function/px";
        @import "../../function/breakpoint-suffix";
        @import "../../function/next-breakpoint";
        @import "../../function/get-color";
        @import "../../function/remove-list-item";
        @import "../../function/validate-breakpoint-list";
        @import "../../function/mix-color-style-functions.scss";
        @import "../../function/legacy-direction";
        @import "../../function/is-direction";
        @import "../../function/append-important";
        @import "../../function/heading";
        
        // ***************************************************************
        // *** Mixins
        // ***************************************************************
        @import "../../mixin/mq";
        @import "../../mixin/responsive-styles";
        @import "../../mixin/psuedo";
        @import "../../mixin/ratio";
        @import "../../mixin/cover";
        @import "../../mixin/center";
        @import "../../mixin/size";
        @import "../../mixin/shadow";
        @import "../../mixin/button";
        @import "../../mixin/list";
        @import "../../mixin/paper";
        @import "../../mixin/gradient";
        @import "../../mixin/arrow";
        @import "../../mixin/build-utility";
        @import "../../mixin/animations/slide";
        @import "../../mixin/animations/scale-up";
        @import "../../mixin/animations/fade-in";
        
        // ***************************************************************
        // *** Generic
        // ***************************************************************
        @import "../../generic/normalize";
        @import "../../generic/container";
        @import "../../generic/grid";
        @import "../../generic/icons";
        @import "../../generic/load-animation";
        
        // ***************************************************************
        // *** Elements
        // ***************************************************************
        @import "../../element/html";
        @import "../../element/body";
        @import "../../element/headings";
        @import "../../element/list";
        @import "../../element/link";
        @import "../../element/strong";
        @import "../../element/table";
        
        // ***************************************************************
        // *** Objects
        // ***************************************************************
        @import "../../object/article";
        @import "../../object/hero";
        @import "../../object/lead";
        @import "../../object/ripple";
    
        
         // ***************************************************************
        // *** Component & Dependencies
        // ***************************************************************
    `;
