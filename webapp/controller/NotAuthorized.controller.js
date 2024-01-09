sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.thy.ux.abroadempinf.controller.NotAuthorized", {

        onInit: function () {
            this.getRouter().getTarget("notAuthorized").attachDisplay(this._onNotAuthorizedDisplayed, this);
        },
        /**
         * @override
         */
        onNavBack: function() {
            this.getModel("appView").setProperty("/layout", "OneColumn");
             this.getRouter().navTo("list");
        },
        _onNotAuthorizedDisplayed : function () {
            this.getModel("appView").setProperty("/layout", "OneColumn");
        }
    });
});