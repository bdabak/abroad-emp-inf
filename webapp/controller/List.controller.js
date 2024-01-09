sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/m/GroupHeaderListItem",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "com/thy/ux/abroadempinf/model/formatter",
  ],
  function (
    BaseController,
    JSONModel,
    Filter,
    Sorter,
    FilterOperator,
    GroupHeaderListItem,
    Device,
    Fragment,
    formatter
  ) {
    "use strict";

    return BaseController.extend("com.thy.ux.abroadempinf.controller.List", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the list controller is instantiated. It sets up the event handling for the list/detail communication and other lifecycle tasks.
       * @public
       */
      onInit: function () {
        // Control state model
        var oAppTree = this.byId("idAppTree"),
          oViewModel = this._createViewModel();

        this._oAppTree = oAppTree;
        // keeps the filter and search state
        this._oAppTreeFilterState = {
          aFilter: [],
          aSearch: [],
        };

        this.setModel(oViewModel, "listView");

        // Event bus events
        this.oEventBus = this.getOwnerComponent().getEventBus();
        this.oEventBus.subscribe(
          "list",
          "detailOpened",
          this.handleDetailOpened,
          this
        );

        this.getRouter()
          .getRoute("list")
          .attachPatternMatched(this._onListMatched, this);
      },

      /**
       * @public
       */
      onExit: function () {
        this.oEventBus.unsubscribe(
          "list",
          "detailOpened",
          this.handleDetailOpened,
          this
        );
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */
      onTreeDataRequested: function () {
        this._oAppTree.setBusy(true);
      },

      onTreeDataReceived: function (oEvent) {
        var that = this;
        if(!this._activeCitNode){
          this._oAppTree.setBusy(false);
        }else{
          $.each(oEvent.getParameter("data")?.results, function (i, oItem) {
            if (oItem.Id === that._activeCitNode) {
              that._oAppTree.setBusy(false);
              setTimeout(function () {
                that._oAppTree.setBusy(false);
                that._expandPromise();
              }, 500);
              return false;
            }
          });
        }

        this._oAppTree.setBusy(false);
      },
      onTreeUpdateFinished: function(){
        if(!this._bAuthCheck){
          this._bAuthCheck = true;
          if(this._oAppTree?.getBinding("items")?.getChildCount() <= 0){
            this.getRouter().navTo(
              "notAuthorized",
              null,
              null,
              true
            );
          }
          
        }
      },

      /**
       * Event handler called when tree item selected
       * @param {sap.ui.base.Event} oEvent
       */
      onItemPressed: function (e) {
        var oItem = e.getParameter("listItem");
        var bReplace = !Device.system.phone;
        // set the layout property of FCL control to show two columns
        this.getModel("appView").setProperty(
          "/layout",
          "TwoColumnsMidExpanded"
        );
        this.getRouter().navTo(
          "detail",
          {
            objectId: oItem.getBindingContext().getProperty("Id"),
          },
          null,
          bReplace
        );
      },

      onTreeCollapseAll: function(){
        this._oAppTree.collapseAll();
      },

      onTreeExpandAll: function(){
        this._oAppTree.expandToLevel(3);
      },
      onTreeLocateNode: function(){
        var that = this;
        var aItems = this._oAppTree.getItems();
        $.each(aItems, function (i, oItem) {
          try {
            var sAppId = oItem.data("applicationId");
            var aApp = sAppId.split("-");
            var r = that._oAppTree.indexOfItem(oItem);

            if (r === -1) {
              return true;
            }

            if (aApp[0] === "REG" && sAppId !== that._activeRegNode) {
              that._oAppTree.collapse(r, false);
              return true;
            }

            if (aApp[0] === "COU" && sAppId !== that._activeCouNode) {
              that._oAppTree.collapse(r, false);
              return true;
            }

            if (aApp[0] === "CIT" && sAppId !== that._activeCitNode) {
              that._oAppTree.collapse(r, false);
              return true;
            }
          } catch (e) {
            return true;
          }

          if (sAppId === that._activeRegNode) {
            that._oAppTree.expand(r);
            return true;
          } else if (sAppId === that._activeCouNode) {
            that._oAppTree.expand(r);
            return true;
          } else if (sAppId === that._activeCitNode) {
            that._oAppTree.expand(r);
            return true;
          }
        });
      },

      /**
       * Event handler for navigating back.
       * We navigate back in the browser history
       * @public
       */
      onNavBack: function () {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      },

      /**
       * Event bus handler called when  <DetailOpened Custom Event> published
       * @public
       */
      handleDetailOpened: function (v, e, p) {
        var aApp = p.objectId.split("-");

        this._activeRegNode = `REG-${aApp[1]}`;
        this._activeCouNode = `COU-${aApp[1]}-${aApp[2]}`;
        this._activeCitNode = `CIT-${aApp[1]}-${aApp[2]}-${aApp[3]}`;

        this._expandPromise();
      },
      onToggleOpenState: function (oEvent) {
        
      },
      _expandPromise: function () {
        this.onTreeLocateNode();
      },

      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */

      _createViewModel: function () {
        return new JSONModel({
          delay: 0,
        });
      },

      _onListMatched: function () {
        var that = this;
        //Set the layout property of the FCL control to 'OneColumn'
        this.getModel("appView").setProperty("/layout", "OneColumn");
        setTimeout(()=>{
          that._oAppTree.collapseAll();
        },300);
        
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @private
       */
    });
  }
);
