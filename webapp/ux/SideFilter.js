sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.abroadempinf.ux.SideFilter", {
    metadata: {
      properties: {
		title:{
			type: "string",
			bindable: true
		},
		logo:{
			type: "string",
			bindable: true
		}
	  },
      aggregations: {
		navLinks:{
			type: "com.thy.ux.abroadempinf.ux.SideFilterNavLinks",
			multiple: false
		}
	  },
	  defaultAggregation: "navLinks",
      events: {
        select: {
			parameters : {
			   selectedItem : {type : "com.thy.ux.abroadempinf.ux.SideFilterNavLinkItem"}
			}
		},
      },
    },
    init: function () {
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl) 
        .class("smod-sf")
        .openEnd() //--Side filter main

		//--Logo
		.openStart("div") 
		.class("smod-sf-logo-details")
		.openEnd()

		.openStart("i") //--Logo icon
		.class("fa")
		.class("fa-solid")
		.class("fa-bars")
		.class("toggleMenu")
		.openEnd()
		.close("i") //-- Logo icon

		.openStart("span") //--Logo title
		.class("smod-sf-title")
		.openEnd()
		.text(oControl.getTitle())
		.close("span") //-- Logo title

        .close("div") 
		//--Logo

		//--Nav links
		.renderControl(oControl.getNavLinks())
		//--Nav links

        .close("div"); //--Side filter main
    },
	ontap: function(e){
        e.preventDefault();
        e.stopPropagation();
        if($(e.target).hasClass("toggleMenu")){
          this.$().toggleClass("close");
        }
      }
  });
});
