module.exports.sassTemplate = `
        
        // ***************************************************************
        // *** Settings
        // ***************************************************************
        @use "../../setting/variables";
        
        // ***************************************************************
        // *** Functions
        // ***************************************************************
        @use "../../function/strip-unit";
        @use "../../function/em";
        @use "../../function/rem";
        @use "../../function/px";
        @use "../../function/breakpoint-suffix";
        @use "../../function/next-breakpoint";
        @use "../../function/get-color";
        @use "../../function/remove-list-item";
        @use "../../function/validate-breakpoint-list";
        @use "../../function/mix-color-style-functions.scss";
        @use "../../function/legacy-direction";
        @use "../../function/is-direction";
        @use "../../function/append-important";
        @use "../../function/heading";
        
        // ***************************************************************
        // *** Mixins
        // ***************************************************************
        @use "../../mixin/mq";
        @use "../../mixin/responsive-styles";
        @use "../../mixin/psuedo";
        @use "../../mixin/ratio";
        @use "../../mixin/cover";
        @use "../../mixin/center";
        @use "../../mixin/size";
        @use "../../mixin/shadow";
        @use "../../mixin/button";
        @use "../../mixin/list";
        @use "../../mixin/paper";
        @use "../../mixin/gradient";
        @use "../../mixin/arrow";
        @use "../../mixin/build-utility";
        @use "../../mixin/animations/slide";
        @use "../../mixin/animations/scale-up";
        @use "../../mixin/animations/fade-in";
        
        // ***************************************************************
        // *** Generic
        // ***************************************************************
        @use "../../generic/normalize";
        @use "../../generic/container";
        @use "../../generic/grid";
        @use "../../generic/icons";
        @use "../../generic/load-animation";
        
        // ***************************************************************
        // *** Elements
        // ***************************************************************
        @use "../../element/html";
        @use "../../element/body";
        @use "../../element/headings";
        @use "../../element/list";
        @use "../../element/link";
        @use "../../element/strong";
        @use "../../element/table";
        
        // ***************************************************************
        // *** Objects
        // ***************************************************************
        @use "../../object/article";
        @use "../../object/hero";
        @use "../../object/lead";
        @use "../../object/ripple";
    
        
         // ***************************************************************
        // *** Component & Dependencies
        // ***************************************************************
    `;
