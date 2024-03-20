sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.abroadempinf.ux.Divider", {

        renderer: function(oRM, oControl){
            oRM.openStart("div", oControl)
               .class("smod-divider")
               .openEnd()
               .close("div");         
        }
	});
});