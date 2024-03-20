sap.ui.define([
	"sap/ui/core/Control"
], function(
	Control
) {
	"use strict";

	return Control.extend("com.thy.ux.abroadempinf.ux.SideFilterNavLinks", {
        metadata: {
            properties: {
              title:{
                type: "string",
                bindable: true
              }
            },
            aggregations: {
              links:{
                 type: "com.thy.ux.abroadempinf.ux.SideFilterNavLink",
                 multiple: "true",
                 singularName: "link"
              }
            },
            events: {
              press: {},
            },
          },
          init: function () {
          
          },
          renderer: function (oRM, oControl) {
            const aLinks = oControl.getLinks() || [];
            oRM
            //--Side filter links
            .openStart("ul", oControl) 
            .class("smod-sf-nav-links")
            .openEnd(); 

            aLinks.forEach((oLink)=>{
              oRM.renderControl(oLink);
            });


            oRM.close("ul");
            //--Side filter links
          }
	});
});