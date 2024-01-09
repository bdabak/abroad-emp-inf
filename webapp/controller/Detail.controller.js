sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/ComponentContainer",
    "com/thy/ux/abroadempinf/model/formatter",
  ],
  function (
    BaseController,
    JSONModel,
    Fragment,
    ComponentContainer,
    formatter
  ) {
    "use strict";

    return BaseController.extend("com.thy.ux.abroadempinf.controller.Detail", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      onInit: function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page is busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data
        var oViewModel = new JSONModel({
          busy: false,
          delay: 0,
          generalInformation: {
            mercerBusy: false,
            mercerReportCount: 0,
            hrbpBusy: false,
            hrbpReportCount: 0,
            draftBusy: false,
            draftContractCount: 0,
          },
          benefitsInformation: {
            benefitBusy: false,
            benefitCount: 0,
          },
          employeeInformation: {
            localEmployeeBusy: false,
            localEmployeeCount: 0,
            centralEmployeeBusy: false,
            centralEmployeeCount: 0,
          },
          workExperience: {
            busy: false,
            count: 0,
          },
        });
        this.setModel(oViewModel, "detailView");

        //--Event handler
        this.oEventBus = this.getOwnerComponent().getEventBus();

        this.getRouter()
          .getRoute("detail")
          .attachPatternMatched(this._onDetailMatched, this);
        // this.getRouter()
        //   .getRoute("scaleDisplay")
        //   .attachPatternMatched(this._onScaleMatched, this);
      },
      onExit: function () {
        for (var sPropertyName in this._formFragments) {
          if (
            !this._formFragments.hasOwnProperty(sPropertyName) ||
            this._formFragments[sPropertyName] == null
          ) {
            return;
          }

          this._formFragments[sPropertyName].destroy();
          this._formFragments[sPropertyName] = null;
        }
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */
      onDocumentDownload: function (oEvent) {
        var oModel = this.getModel();
        var sLink =
          oModel.sServiceUrl + oEvent.getSource().data("documentLink");

        sap.m.URLHelper.redirect(sLink, true);
      },
      onMercerDocumentDataRequested: function (oEvent) {
        this._setDocStatistic("mercerBusy", true);
        this._setDocStatistic("mercerReportCount");
      },
      onMercerDocumentDataReceived: function (oEvent) {
        this._setDocStatistic("mercerBusy", false);
        this._setDocStatistic(
          "mercerReportCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },
      onHRBPDocumentDataRequested: function (oEvent) {
        this._setDocStatistic("hrbpBusy", true);
        this._setDocStatistic("hrbpReportCount");
      },
      onHRBPDocumentDataReceived: function (oEvent) {
        this._setDocStatistic("hrbpBusy", false);
        this._setDocStatistic(
          "hrbpReportCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },

      onDraftDocumentDataRequested: function (oEvent) {
        this._setDocStatistic("draftBusy", true);
        this._setDocStatistic("draftContractCount");
      },
      onDraftDocumentDataReceived: function (oEvent) {
        this._setDocStatistic("draftBusy", false);
        this._setDocStatistic(
          "draftContractCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },
      onBenefitsDataRequested: function () {
        this._setBenStatistic("benefitBusy", true);
        this._setBenStatistic("benefitCount");
      },
      onBenefitsDataReceived: function (oEvent) {
        this._setBenStatistic("benefitBusy", false);
        this._setBenStatistic(
          "benefitCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },

      onLocalEmployeeDataRequested: function () {
        this._setEmpStatistic("localEmployeeBusy", true);
        this._setEmpStatistic("localEmployeeCount");
      },
      onLocalEmployeeDataReceived: function (oEvent) {
        this._setEmpStatistic("localEmployeeBusy", false);
        this._setEmpStatistic(
          "localEmployeeCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },
      onCentralEmployeeDataRequested: function () {
        this._setEmpStatistic("centralEmployeeBusy", true);
        this._setEmpStatistic("centralEmployeeCount");
      },
      onCentralEmployeeDataReceived: function (oEvent) {
        this._setEmpStatistic("centralEmployeeBusy", false);
        this._setEmpStatistic(
          "centralEmployeeCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },

      onWorkExperienceDataRequested: function () {
        this._setWexStatistic("busy", true);
        this._setWexStatistic("count", 0);
      },

      onWorkExperienceDataReceived: function (oEvent) {
        this._setWexStatistic("busy", false);
        this._setWexStatistic(
          "count",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },

      onAfterCloseWorkExperience: function (oEvent) {
        var oPopover = oEvent.getSource();
        oPopover.destroy();
        this._oWexPopover = null;
      },
      onCloseWorkExperience: function(){
        if(this._oWexPopover){
          this._oWexPopover.close();
        }
      },
      onShowWorkExperience: function (oEvent) {
        var oSource = oEvent.getSource();
        var sBinding = oSource.data("bindingPath");
        var oView = this.getView();

        var oPromise = Fragment.load({
          id: oView.getId(),
          name: "com.thy.ux.abroadempinf.fragments.EmployeeInfo.WorkExperience",
          controller: this,
        }).then(function (o) {
          oView.addDependent(o);
          o.bindElement(sBinding);
          return o;
        });

        oPromise.then(function (oPopover) {
          this._oWexPopover = oPopover;
          this._oWexPopover.openBy(oSource);
        }.bind(this));
      },

      onCallResume: function (oEvent) {
        var oSource = oEvent.getSource();
        var sId = oSource.data("employeeId");

        this.oCrossAppNavigator =
          sap?.ushell?.Container?.getService("CrossApplicationNavigation") ||
          null;
        if (this.oCrossAppNavigator) {
          this.oCrossAppNavigator.toExternal({
            target: {
              semanticObject: "Z5HPA_CV",
              action: "display",
            },
            params: {
              pernr: sId,
            },
          });
        }
      },
      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */
      _setDocStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/generalInformation/" + p, v);
      },
      _setBenStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/benefitsInformation/" + p, v);
      },
      _setEmpStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/employeeInformation/" + p, v);
      },
      _setWexStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/workExperience/" + p, v);
      },

      /**
       * Binds the view to the object path and expands the aggregated line items.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onScaleMatched: function (oEvent) {
        var sObjectId = oEvent.getParameter("arguments").objectId;

        this.oEventBus.publish("list", "detailOpened", {
          objectId: sObjectId,
        });

        this.sObjectId = sObjectId;
        this.getModel("appView").setProperty(
          "/layout",
          "TwoColumnsMidExpanded"
        );

        var sObjectPath = this.getModel().createKey("ApplicationTreeSet", {
          Id: sObjectId,
        });
        this._bindView("/" + sObjectPath);
      },
      /**
       * Binds the view to the object path and expands the aggregated line items.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onDetailMatched: function (oEvent) {
        var sObjectId = oEvent.getParameter("arguments").objectId;

        this.oEventBus.publish("list", "detailOpened", {
          objectId: sObjectId,
        });

        this.sObjectId = sObjectId;
        this.getModel("appView").setProperty(
          "/layout",
          "TwoColumnsMidExpanded"
        );
        this.getModel()
          .metadataLoaded()
          .then(
            function () {
              var sObjectPath = this.getModel().createKey(
                "ApplicationTreeSet",
                {
                  Id: sObjectId,
                }
              );
              this._bindView("/" + sObjectPath);
            }.bind(this)
          );
      },

      /**
       * Binds the view to the object path. Makes sure that detail view displays
       * a busy indicator while data for the corresponding element binding is loaded.
       * @function
       * @param {string} sObjectPath path to the object to be bound to the view.
       * @private
       */
      _bindView: function (sObjectPath) {
        // Set busy indicator during view binding
        var oViewModel = this.getModel("detailView");
        var oModel = this.getModel();
        var that = this;

        // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
        oViewModel.setProperty("/busy", false);

        this.getView().bindElement({
          path: sObjectPath,
          parameters: {
            expand: "Region,Country,City,Application",
          },
          events: {
            change: function () {
              that._bindingChanged(sObjectPath);
            },
            dataRequested: function () {
              oViewModel.setProperty("/busy", true);
            },
            dataReceived: function (oData, oResponse) {
              oViewModel.setProperty("/busy", false);
            },
          },
        });
      },

      _formFragments: {},

      _setContentFragment: function (oApp, oPage) {

        // this._setFormFragment(oApp.ApplicationKey, oPage);

        var that = this;
        var sFragmentName = oApp.ApplicationKey;

        this._oFragment = Fragment.load({
          name: "com.thy.ux.abroadempinf.fragments." + sFragmentName,
          controller: this,
        }).then((oContent) => {
          switch (sFragmentName) {
            case "PayScaleInfo":
              that._loadPayScaleInfo(oApp, oPage, oContent);
              break;
            default:
              oPage.setContent(oContent);
          }
        });
      },

      _modifyPayScalePage: function(oComp){
        var oPage = oComp.getAggregation("rootControl").getAggregation("content")[0]
        oPage.removeStyleClass("sapUiContentPadding").addStyleClass("sapUiNoContentPadding");
        var oPanel = oPage.getAggregation("content")[0];
        oPanel.removeStyleClass("sapUiContentPadding").addStyleClass("sapUiNoContentPadding");
      },
      _loadPayScaleInfo: function (oApp, oPage, oContent) {
        oPage.setBusy(true);
        var aChunk = oApp?.Id.split("-") || [];
        var sRegion = null;
        if(aChunk[2] && aChunk[3]){
          sRegion = btoa(JSON.stringify({
            Werks: aChunk[2],
            Btrtl: aChunk[3]
          }))
        }
        this.getOwnerComponent().createComponent({
          usage: "scaleDisplayComponent",
            settings: {},
            componentData: {
              startupParameters: {
                RegionSelection: sRegion ? {
                  0: sRegion
                } : null  
              },
            },
            async: true,
            manifest: true
          })
          .then(
            function (oComp) {
              oContent.setComponent(oComp);
              this._modifyPayScalePage(oComp);
              oPage.setContent(
                oContent
              );
              oPage.setBusy(false);
            }.bind(this)
          )
          .catch(function (oError) {
            jQuery.sap.log.error(oError);
          });
      },

      _loadEmployeeLookup: function () {
        this.getOwnerComponent()
          .createComponent({
            usage: "employeeLookupComponent",
            settings: {},
            componentData: {
              startupParameters: {
                mode: { 0: "MSS" },
              },
            },
            async: true,
          })
          .then(
            function (oComp) {
              //to avoid "The Popup content is NOT connected with a UIArea and may not work properly!"
              this.byId("myVBox").addItem(
                new ComponentContainer({
                  //settings: { renderButton : false },
                  component: oComp,
                })
              );
            }.bind(this)
          )
          .catch(function (oError) {
            jQuery.sap.log.error(oError);
          });
      },

      _bindingChanged: function (sObjectPath) {
        var oModel = this.getModel();
        var oPage = this.byId("idDetailPage");

        oPage.destroyContent();

        oModel.read(sObjectPath, {
          success: function (oData) {
            this._setContentFragment(oData, oPage);
          }.bind(this),
          error: function () {},
        });
      },

      /**
       * Set the full screen mode to false and navigate to list page
       */
      onCloseDetailPress: function () {
        this.getModel("appView").setProperty("/layout", "OneColumn");
        this.getRouter().navTo("list");
      },

      /**
       * Toggle between full and non full screen mode.
       */
      toggleFullScreen: function () {
        var bFullScreen = this.getModel("appView").getProperty(
          "/actionButtonsInfo/midColumn/fullScreen"
        );
        this.getModel("appView").setProperty(
          "/actionButtonsInfo/midColumn/fullScreen",
          !bFullScreen
        );
        if (!bFullScreen) {
          // store current layout and go full screen
          this.getModel("appView").setProperty(
            "/previousLayout",
            this.getModel("appView").getProperty("/layout")
          );
          this.getModel("appView").setProperty(
            "/layout",
            "MidColumnFullScreen"
          );
        } else {
          // reset to previous layout
          this.getModel("appView").setProperty(
            "/layout",
            this.getModel("appView").getProperty("/previousLayout")
          );
        }
      },
    });
  }
);
