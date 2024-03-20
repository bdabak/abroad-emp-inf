sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function (Controller, History) {
    "use strict";

    return Controller.extend(
      "com.thy.ux.abroadempinf.controller.BaseController",
      {
        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getText: function (sTextCode, aParam) {
          var aTextParam = aParam;
          if (!aTextParam) {
            aTextParam = [];
          }
          return this.getResourceBundle().getText(sTextCode, aTextParam);
        },
        alertText: function (sType, sTitle, sMessage) {
          var sIcon;

          switch (sType) {
            case "W":
              sIcon = "warning";
              break;
            case "E":
              sIcon = "error";
              break;
            case "S":
              sIcon = "success";
              break;
            case "I":
              sIcon = "information";
              break;
            default:
              sIcon = "success";
          }

          this.showMessage({
            text: sMessage,
            title: this.getText(sTitle),
            icon: sIcon,
            showConfirmButton: true,
            timer: undefined,
          });
        },
        alertMessage: function (sType, sTitle, sMessage, aMessageParam) {
          var sIcon;

          switch (sType) {
            case "W":
              sIcon = "warning";
              break;
            case "E":
              sIcon = "error";
              break;
            case "S":
              sIcon = "success";
              break;
            case "I":
              sIcon = "information";
              break;
            default:
              sIcon = "success";
          }

          this.showMessage({
            html: this.getText(sMessage, aMessageParam),
            title: this.getText(sTitle),
            icon: sIcon,
            showConfirmButton: true,
            timer: undefined,
          });
        },

        toastMessage: function (sType, sTitle, sMessage, aMessageParam) {
          var sIcon;

          switch (sType) {
            case "W":
              sIcon = "warning";
              break;
            case "E":
              sIcon = "error";
              break;
            case "S":
              sIcon = "success";
              break;
            case "I":
              sIcon = "info";
              break;
            default:
              sIcon = "success";
          }

          this.showMessage({
            html: this.getText(sMessage, aMessageParam),
            title: this.getText(sTitle),
            icon: sIcon,
            showConfirmButton: sIcon !== "success",
          });
        },

        showMessage: function (opts) {
          var options = {
            title: null,
            text: null,
            html: null,
            icon: "info",
            position: "top-end",
            showConfirmButton: false,
            confirmButtonText: this.getText("CONFIRM_ACTION", []),
            confirmButtonColor: "#3085d6",
            showCancelButton: false,
            cancelButtonText: this.getText("CANCEL_ACTION", []),
            cancelButtonColor: "#d33",
            showCloseButton: false,
            toast: true,
            timer: 5000,
            timerProgressBar: false,
            // customClass: {
            // 	popup: "colored-toast"
            // },
            // iconColor: "white",
            backdrop: false,
          };

          for (var k in options) {
            if (opts.hasOwnProperty(k)) {
              options[k] = opts[k];
            }
          }

          Swal.fire({ ...options }).then(function (result) {
            if (result.isConfirmed) {
              if (opts.confirmCallbackFn !== undefined) {
                try {
                  opts.confirmCallbackFn();
                } catch (e) {}
              }
            }
            if (result.isCancelled) {
              if (opts.cancelCallbackFn !== undefined) {
                try {
                  opts.cancelCallbackFn();
                } catch (e) {}
              }
            }
          });
        },
        confirmDialog: function (opts) {
          var options = {
            title: null,
            html: null,
            icon: "info",
            position: "center",
            timer: undefined,
            timerProgressBar: false,
            showConfirmButton: true,
            confirmButtonText: this.getText("CONFIRM_ACTION", []),
            confirmButtonColor: "#3085d6",

            showCancelButton: true,
            cancelButtonText: this.getText("CANCEL_ACTION", []),
            cancelButtonColor: "#d33",
            showCloseButton: false,
            focusConfirm: true,
            toast: false,
            timer: undefined,
            timerProgressBar: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            input: undefined,
            inputLabel: "",
            inputPlaceholder: "",
            inputAttributes: {},
            preConfirm: null,
          };

          for (var k in options) {
            if (opts.hasOwnProperty(k)) {
              options[k] = opts[k];
            }
          }

          Swal.fire({ ...options }).then(function (result) {
            if (result.isConfirmed) {
              if (opts.confirmCallbackFn !== undefined) {
                try {
                  opts.confirmCallbackFn();
                } catch (e) {}
              }
            }
            if (result.isCancelled) {
              if (opts.cancelCallbackFn !== undefined) {
                try {
                  opts.cancelCallbackFn();
                } catch (e) {}
              }
            }
          });
        },
        openBusyFragment: function (sTextCode = null, aMessageParameters = []) {
          var oDialog = this._getBusyFragment();
          var that = this;
          if (sTextCode) {
            oDialog.setText(this.getText(sTextCode, aMessageParameters));
          } else {
            oDialog.setText(this.getText("PLEASE_WAIT", []));
          }

          setTimeout(function () {
            oDialog.open();
          }, 100);
        },

        closeBusyFragment: function () {
          var oDialog = this._getBusyFragment();
          var that = this;
          var _close = function () {
            oDialog.close();
          };
          setTimeout(_close, 500);
        },

        /**
         * Convenience method for get generic Busy fragment
         * @private
         * @returns {com.thy.ux.emailtemplate.fragment.BusyDialog} the router for this component
         */
        _getBusyFragment: function () {
          this.oBusyDialog = sap.ui.getCore().byId("GenericBusyDialog") || null;

          if (!this.oBusyDialog) {
            this.oBusyDialog = sap.ui.xmlfragment(
              "com.thy.ux.abroadempinf.fragments.GenericBusyDialog",
              this
            );

            this.getView().addDependent(this.oBusyDialog);
          }

          return this.oBusyDialog;
        },

        /**
         * Event handler for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the list route.
         * @public
         */
        onNavBack: function () {
          var sPreviousHash = History.getInstance().getPreviousHash();

          if (sPreviousHash !== undefined) {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
          } else {
            this.getRouter().navTo("list", {}, true);
          }
        },
      }
    );
  }
);
