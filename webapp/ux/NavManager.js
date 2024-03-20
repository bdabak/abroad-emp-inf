sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("com.thy.ux.abroadempinf.ux.NavManager", {
    metadata: {
      properties: {},
      aggregations: {
        sideFilter: {
          type: "sap.ui.core.Control",
          multiple: false,
        },
        mainContent: {
          type: "sap.m.Page",
          multiple: false,
        },
      },
      events: {
        press: {},
      },
    },
    init: function () {
      //initialisation code, in this case, ensure css is imported
      var sLibraryPath = jQuery.sap.getModulePath("com.thy.ux.abroadempinf"); //get the server location of the ui library
      jQuery.sap.includeStyleSheet(sLibraryPath + "/ux/SideFilter.css");
    },
    renderer: function (oRM, oControl) {
      oRM
        .openStart("div", oControl)
        .class("smod-nav-manager")
        .openEnd()
        .openStart("div") 
        .class("smod-nav-manager-sidenav")
        .openEnd()
        .renderControl(oControl.getSideFilter())
        .close("div")
        .openStart("div") 
        .class("smod-nav-manager-page")
        .openEnd()
        .renderControl(oControl.getMainContent())
        .close("div")
        .close("div");
    },
  });
});
