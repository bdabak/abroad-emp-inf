sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "com.thy.ux.abroadempinf.ux.SideFilterNavLink",
    {
      metadata: {
        properties: {
          text: {
            type: "string",
            bindable: true,
          },
          logo: {
            type: "string",
            bindable: true,
          },
        },
        aggregations: {
          items: {
            type: "com.thy.ux.abroadempinf.ux.SideFilterNavLinkItem",
            multiple: "true",
            singularName: "item",
          },
        },
        events: {
          press: {},
        },
      },
      init: function () {},
      renderer: function (oRM, oControl) {
        const aItems = oControl.getItems() || [];
        const sText = oControl.getText() || "";
        const sLogo = oControl.getLogo() || "";
        oRM
          //--Side filter link
          .openStart("li", oControl)
          .class(aItems.length > 0 ? "menuLink" : "directLink")
          .class(aItems.length > 0 ? "showMenu" : null)
          .openEnd();

        if (aItems.length === 0) {
          oRM
            .openStart("a")
            .attr("href", "#")
            .openEnd()

            .openStart("i") //--Logo icon
            .class("fa")
            .class("fa-solid")
            .class(sLogo)
            .openEnd()
            .close("i") //-- Logo icon

            .openStart("span") //--Logo title
            .class("smod-sf-link-name")
            .openEnd()
            .text(sText)
            .close("span") //-- Logo title

            .close("a")

            //--Submenu
            .openStart("ul")
            .class("smod-sf-sub-menu")
            .class("blank")
            .openEnd()

            //--Item text
            .openStart("li")
            .openEnd()

            //--Popover link
            .openStart("a")
            .class("smod-sf-link-name")
            .attr("href", "#")
            .openEnd()
            .text(sText)
            .close("a")
            //--Popover link

            .close("li")
            //--Item text

            .close("ul");
          //--Submenu
        } else {
          oRM
            .openStart("div")
            .class("smod-sf-iocn-link")
            .openEnd()

            //--Item text & logo
            .openStart("a")
            .class("menuLink")
            .attr("href", "#")
            .openEnd()

            .openStart("i") //--Logo icon
            .class("fa")
            .class("fa-solid")
            .class(sLogo)
            .openEnd()
            .close("i") //-- Logo icon

            .openStart("span") //--Logo title
            .class("smod-sf-link-name")
            .openEnd()
            .text(sText)
            .close("span") //-- Logo title

            .close("a")
            //--Item text & logo

            //--Chevron
            .openStart("i")
            .class("fa")
            .class("fa-solid")
            .class("fa-chevron-down")
            .class("arrow")
            .openEnd()
            .close("i")
            //--Chevron

            .close("div")

            //--Submenu
            .openStart("ul")
            .class("smod-sf-sub-menu")
            .openEnd()

            //--Item text
            .openStart("li")
            .class("menuTitle")
            .openEnd()

            //--Popover header
            .openStart("a")
            .class("smod-sf-link-name")
            .class("menuLink")
            .attr("href", "#")
            .openEnd()
            .text(sText)
            .close("a")
            //--Popover header

          //--Item text

          aItems.forEach((oItem) => {
            oRM.renderControl(oItem);
          });

          oRM.close("ul");
        }

        oRM.close("li");
        //--Side filter link
      },
      ontap: function(e){
        e.preventDefault();
        e.stopPropagation();
       
        if(this.$().hasClass("menuLink")){
          this.$().toggleClass("showMenu");
        }
      }
    }
  );
});
