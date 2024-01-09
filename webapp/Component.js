jQuery.sap.registerModulePath("hcm.employee.lookup", "/sap/bc/ui5_ui5/sap/hcm_emp_lookup"); 
jQuery.sap.registerModulePath("ZHCM_YD_SKALA", "/sap/bc/ui5_ui5/sap/ZHCM_YD_SKALA"); 
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models",
    "./controller/ErrorHandler",
    "sap/ui/core/IconPool"
], 
function (UIComponent, Device, models, ErrorHandler, IconPool) {
    "use strict";

    return UIComponent.extend("com.thy.ux.abroadempinf.Component", {
        /**
         * @param {typeof sap.ui.model.json.JSONModel} JSONModel
         * @param {typeof sap.ui.Device} Device
         */ 
        metadata : {
            manifest : "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * In this method, the device models are set and the router is initialized.
         * @public
         * @override
         */
        init : function () {
            this._oErrorHandler = new ErrorHandler(this);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // call the base component's init function and create the App view
            UIComponent.prototype.init.apply(this, arguments);

            // create the views based on the url/hash
            this.getRouter().initialize();

            this.initIconPool();
        },

        initIconPool: function(){
            IconPool.addIcon("fl-tr", "flags", "flags", "e90b");
            IconPool.addIcon("fl-gb", "flags", "flags", "e906");
            IconPool.addIcon("fl-de", "flags", "flags", "e900");
            IconPool.addIcon("fl-fr", "flags", "flags", "e903");
        },

        /**
         * The component is destroyed by UI5 automatically.
         * In this method, ErrorHandler are destroyed.
         * @public
         * @override
         */
        destroy : function () {
            this._oErrorHandler.destroy();
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },

        /**
         * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
         * design mode class should be set, which influences the size appearance of some controls.
         * @public
         * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
         */
        getContentDensityClass : function() {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line sap-no-proprietary-browser-api
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }

    });
});