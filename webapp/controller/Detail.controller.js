sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/format/NumberFormat",
    "com/thy/ux/abroadempinf/ux/Divider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/QuickView",
    "sap/m/QuickViewPage",
    "sap/m/QuickViewGroup",
    "sap/m/QuickViewGroupElement",
    "com/thy/ux/abroadempinf/model/formatter",
  ],
  function (
    BaseController,
    JSONModel,
    Fragment,
    ComponentContainer,
    NumberFormat,
    Divider,
    Filter,
    FilterOperator,
    QuickView,
    QuickViewPage,
    QuickViewGroup,
    QuickViewGroupElement,
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
            draftCentralBusy: false,
            draftContractCentralCount: 0,
            draftLocalBusy: false,
            draftContractLocalCount: 0,
            legalRegulationsBusy: false,
            legalRegulationsCount: 0,
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
          legislation: {
            busy: false,
            visible: false
          },
          compensationManagement: this._invalidateCompensation(),
        });
        this.setModel(oViewModel, "detailView");

        //--Event handler
        this.oEventBus = this.getOwnerComponent().getEventBus();
        this.oEventBus.subscribe(
          "general",
          "notAuthorized",
          this.handleNotAuthorized,
          this
        );

        this.getRouter()
          .getRoute("detail")
          .attachPatternMatched(this._onDetailMatched, this);
        
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

        this.oEventBus.unsubscribe(
          "general",
          "notAuthorized",
          this.handleNotAuthorized,
          this
        );
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

      onDraftCentralDocumentDataRequested: function (oEvent) {
        this._setDocStatistic("draftCentralBusy", true);
        this._setDocStatistic("draftContractCentralCount");
      },

      onDraftCentralDocumentDataReceived: function (oEvent) {
        this._setDocStatistic("draftCentralBusy", false);
        this._setDocStatistic(
          "draftContractCentralCount",
          oEvent.getParameter("data")?.results?.length || 0
        );
      },

      onDraftLocalDocumentDataRequested: function (oEvent) {
        this._setDocStatistic("draftLocalBusy", true);
        this._setDocStatistic("draftContractLocalCount");
      },

      onDraftLocalDocumentDataReceived: function (oEvent) {
        this._setDocStatistic("draftLocalBusy", false);
        this._setDocStatistic(
          "draftContractLocalCount",
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
      onCompensationDataRequested: function () {
        this._setCompStatistic("busy", true);
        this._setCompStatistic("employeeCount", 0);
      },
      onCompensationDataReceived: function (oEvent) {
        this._setCompStatistic("busy", false);
        this._setCompStatistic(
          "employeeCount",
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

      onLegalRegulationsDataRequested: function (oEvent) {
        this._setDocStatistic("legalRegulationsBusy", true);
        this._setDocStatistic("legalRegulationsCount");
      },

      onLegalRegulationsDataReceived: function (oEvent) {
        this._setDocStatistic("legalRegulationsBusy", false);
        this._setDocStatistic(
          "legalRegulationsCount",
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
      onLegislationDataRequested: function(){
        this._setLegStatistic("busy", true);
      },

      onLegislationDataReceived: function(){
        this._setLegStatistic("busy", false);
      },

      onAfterCloseWorkExperience: function (oEvent) {
        var oPopover = oEvent.getSource();
        oPopover.destroy();
        this._oWexPopover = null;
      },
      onCloseWorkExperience: function () {
        if (this._oWexPopover) {
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

        oPromise.then(
          function (oPopover) {
            this._oWexPopover = oPopover;
            this._oWexPopover.openBy(oSource);
          }.bind(this)
        );
      },

      onCallResume: function (oEvent) {
        var oSource = oEvent.getSource();
        var sId = oSource.data("employeeId");
        var sName = oSource.data("employeeName");

        const sDownloadUrl = `/sap/opu/odata/sap/ZGHPA_CV_SRV/CvPdfSet(Pernr='${sId}',Selections='organisationSectionS1-additonalDutySectionS1-deputationSectionS1-personalSectionS1-partnerSectionS1-SchoolSectionS1-qualificationSectionS1-qualificationothersSectionS1-awardSectionS1-punishmentSectionS1-leaveSectionS1-UiSectionS1-statisticSectionS1-contactSectionS1')/$value`;

        sap.m.URLHelper.redirect(sDownloadUrl, true);

        this.toastMessage("I", "RESUME", "RESUME_BEING_DOWNLOADED",  [sName])

        // https://tempotest.thy.com/sap/opu/odata/sap/ZGHPA_CV_SRV/CvPdfSet(Pernr='00052805',Selections='organisationSectionS1-additonalDutySectionS1-deputationSectionS1-personalSectionS1-partnerSectionS1-SchoolSectionS1-qualificationSectionS1-qualificationothersSectionS1-awardSectionS1-punishmentSectionS1-leaveSectionS1-UiSectionS1-statisticSectionS1-contactSectionS1')/$value

        // this.oCrossAppNavigator =
        //   sap?.ushell?.Container?.getService("CrossApplicationNavigation") ||
        //   null;
        // if (this.oCrossAppNavigator) {
        //   this.oCrossAppNavigator.toExternal({
        //     target: {
        //       semanticObject: "Z5HPA_CV",
        //       action: "display",
        //     },
        //     params: {
        //       pernr: sId,
        //     },
        //   });
        // }
      },
      handleNotAuthorized: function () {
        this.getModel("appView").setProperty("/layout", "OneColumn");
        this.getRouter().navTo("list");
      },
      onWageEntered: function (oEvent) {
        const oSource = oEvent.getSource();
        const oData = oSource.data("CompData");

        this._setCompStatistic("saveAllowed", false);

        let sNewValue = oEvent.getParameter("newValue");

        try {
          sNewValue = parseFloat(sNewValue.replace(/,/g, "."));
        } catch (e) {
          //
        }

        oSource.setValueState(null);
        oSource.setValueStateText(null);

        if (isNaN(sNewValue)) {
          oSource.setValue("0");
          this.alertMessage("E", "ERROR_MESSAGE", "ENTER_A_VALID_WAGE", []);
          oSource.setValueState("Error");
          oSource.setValueStateText(this.getText("ENTER_A_VALID_WAGE", []));
          return;
        }

        if (parseFloat(oData.NewWage) < parseFloat(oData.CurrentWage)) {
          oSource.setValueState("Error");
          this.alertMessage("E", "ERROR_MESSAGE", "ENTER_GREATER_THAN_CUR", [
            parseFloat(oData.NewWage),
            parseFloat(oData.CurrentWage),
          ]);
          oSource.setValueStateText(
            this.getText("ENTER_GREATER_THAN_CUR", [
              parseFloat(oData.NewWage),
              parseFloat(oData.CurrentWage),
            ])
          );
          return;
        }

        this.handleCompChecks();

      },

      handleCompChecks: function (bReturnOk = false) {
        const oViewModel = this.getModel("detailView");
        const aComp = _.cloneDeep(
          oViewModel.getProperty("/compensationManagement/compensationData")
        );

        let aOk = [];

        let bSaveActive = false;
        let iMailTrigger = 0;
        let iOk = 0;

        this._setCompStatistic("saveAllowed", false);

        aComp.forEach((oComp) => {
          if (
            parseFloat(oComp.NewWage) > 0 &&
            parseFloat(oComp.WageRangeMin) > 0 &&
            parseFloat(oComp.WageRangeMax) > 0
          ) {
            if (
              parseFloat(oComp.NewWage) > parseFloat(oComp.WageRangeMax) ||
              parseFloat(oComp.NewWage) < parseFloat(oComp.WageRangeMin)
            ) {
              oComp.OverLimit = true;
            } else {
              oComp.OverLimit = false;
              oComp.MailTriggered = false;
            }

            oComp.NewWage = parseFloat(oComp.NewWage).toFixed(2).toString();

            if (oComp.OverLimit === true && oComp.MailTriggered === true) {
              iOk++;
              aOk.push(oComp);
            } else {
              if (oComp.OverLimit === true && oComp.MailTriggered !== true) {
                iMailTrigger++;
              } else {
                if (
                  parseFloat(oComp.NewWage) >= parseFloat(oComp.WageRangeMin) &&
                  parseFloat(oComp.NewWage) <= parseFloat(oComp.WageRangeMax)
                ) {
                  iOk++;
                  aOk.push(oComp);
                }
              }
            }
          } else {
            oComp.MailTriggered = false;
            oComp.OverLimit = false;
          }
        });

        if (!bReturnOk) {
          if (iOk > 0 && iMailTrigger === 0) {
            bSaveActive = true;
            this.toastMessage("S", "SAVE_ACTIVE", "CHANGES_CAN_BE_SAVED", [
              iOk,
            ]);
          } else if (iMailTrigger > 0) {
            this.alertMessage("W", "MAIL_TRIGGER", "MAIL_TRIGGER_MESSAGE", [
              iMailTrigger,
            ]);
          }
          this._setCompStatistic("compensationData", aComp);
          this._setCompStatistic("saveAllowed", bSaveActive);
        }

        if (bReturnOk) {
          return aOk;
        }
      },

      onCompEmailPress: function (oEvent) {
        const oSource = oEvent.getSource();
        const sId = oSource.data("EmployeeId") || null;
        const sName = oSource.data("EmployeeName");
        if (sId !== null) {
          const oViewModel = this.getModel("detailView");
          const aComp = oViewModel.getProperty(
            "/compensationManagement/compensationData"
          );

          let iIndex = _.findIndex(aComp, ["Id", sId]);

          if (iIndex !== -1 && aComp[iIndex]) {
            aComp[iIndex].MailTriggered = true;
            oViewModel.setProperty(
              "/compensationManagement/compensationData",
              aComp
            );

            this.handleCompChecks();
          }

          try {
            sap.m.URLHelper.triggerEmail(
              "ucretveyanhaklarmdydisi@thy.com",
              `${sName}(${sId}) Ücret Artışı Hakkında`,
              ``
            );
          } catch (e) {}
        }
      },
      onCompEmployeePress: function (oEvent) {
        const oSource = oEvent.getSource();
        const sSen = oSource.data("SeniorityInYears");
        const sExp = oSource.data("ExperienceInYears");

        const oFormat = NumberFormat.getFloatInstance({
          groupingEnabled: false, // grouping is enabled
          decimalSeparator: ",", // the decimal separator must be different from the grouping separator
        });

        const oPopover = new sap.m.Popover({
          content: [
            new sap.m.HBox({
              alignItems: "Center",
              justifyContent: "Center",
              height: "100%",
              items: [
                new sap.m.VBox({
                  alignItems: "Center",
                  justifyContent: "Center",
                  items: [
                    new sap.m.Label({
                      text: "{i18n>SENIORITY}",
                    }),
                    new sap.m.Text({
                      text: oFormat.format(sSen),
                    }),
                  ],
                }),
                new Divider(),
                new sap.m.VBox({
                  alignItems: "Center",
                  justifyContent: "Center",
                  items: [
                    new sap.m.Label({
                      text: "{i18n>EXPERIENCE}",
                    }),
                    new sap.m.Text({
                      text: oFormat.format(sExp),
                    }),
                  ],
                }),
              ],
            }),
          ],
          afterClose: () => {
            oPopover.destroy();
          },
          showHeader: false,
        }).addStyleClass("sapUiContentPadding");

        this.getView().addDependent(oPopover);

        oPopover.openBy(oSource);
      },
      onCompEmployeeInfoPress: function (oEvent) {
        const oSource = oEvent.getSource();
        const oEmployee = oSource.data("EmployeeData");
        const oFormat = NumberFormat.getFloatInstance({
          groupingEnabled: false, // grouping is enabled
          decimalSeparator: ",", // the decimal separator must be different from the grouping separator
        });

        const oPopover = new QuickView({
          afterClose: () => {
            oPopover.destroy();
          },
          pages: [
            new QuickViewPage({
              header: "Çalışan Bilgileri",
              title: oEmployee.EmployeeName,
              description: oEmployee.PositionText,
              icon: `/sap/opu/odata/sap/ZHCM_UX_TABIN_SRV/EmployeeSet('${oEmployee.Id}')/$value`,
              groups: [
                new QuickViewGroup({
                  heading: "Organizasyon ve Eğitim",
                  elements: [
                    new QuickViewGroupElement({
                      label: "Organizasyon Birimi",
                      value: oEmployee.OrganizationText,
                    }),
                    // new QuickViewGroupElement({
                    //   label: "İş",
                    //   value: oEmployee.JobText
                    // }),
                    new QuickViewGroupElement({
                      label: "Eğitim Durumu",
                      value: oEmployee.EducationStatusText
                        ? oEmployee.EducationStatusText
                        : "-",
                    }),
                  ],
                }),
                new QuickViewGroup({
                  heading: "Kıdem Bilgileri",
                  elements: [
                    new QuickViewGroupElement({
                      label: "Kıdem (Gün)",
                      value: oEmployee.SeniorityInDays,
                    }),
                    new QuickViewGroupElement({
                      label: "Kıdem (Yıl)",
                      value: oFormat.format(oEmployee.SeniorityInYears),
                    }),
                  ],
                }),
                new QuickViewGroup({
                  heading: "Önceki Tecrübe Bilgileri",
                  elements: [
                    new QuickViewGroupElement({
                      label: "Tecrübe (Gün)",
                      value: oEmployee.ExperienceInDays
                        ? oEmployee.ExperienceInDays
                        : "-",
                    }),
                    new QuickViewGroupElement({
                      label: "Tecrübe (Yıl)",
                      value: oEmployee.ExperienceInYears
                        ? oFormat.format(oEmployee.ExperienceInYears)
                        : "-",
                    }),
                  ],
                  visible: oEmployee.ExperienceInDays ? true : false,
                }),
              ],
            }),
          ],
        });

        oPopover.openBy(oSource);
      },

      onCompSaveChanges: function () {
        const oModel = this.getModel();
        const oViewModel = this.getModel("detailView");
        let aComp = this.handleCompChecks(true) || [];

        if (aComp.length === 0) {
          return 0;
        }

        const sPath = "/CompensationOperationSet";

        let oPayload = {
          Id: this.sObjectId,
          Opera: "SAVE",
          CompensationSet: aComp,
        };

        this.openBusyFragment("COMPENSATION_DATA_BEING_SAVED", []);
        oModel.create(sPath, oPayload, {
          success: () => {
            this.closeBusyFragment();
            this.toastMessage(
              "S",
              "SUCCESS_MESSAGE",
              "COMPENSATION_DATA_SAVED",
              []
            );
            this._refreshCompensation();
          },
          error: () => {
            this.closeBusyFragment();
          },
        });
      },

      onSideFilterSelect: function(oEvent){
        const oSource = oEvent.getParameter("selectedItem");
        let aKeys = oSource.getKey().split("-");

        if(aKeys.length === 2){
          const oTable = this.byId("idLegislationItems") || sap.ui.getCore().byId("idLegislationItems");
          if(!oTable){
            return;
          }
          let aFilter = [
            new Filter("CategoryId", FilterOperator.EQ, aKeys[0]),
            new Filter("EmployeeClass", FilterOperator.EQ, aKeys[1]),
          ];
          
          oTable.getBinding("items").filter(aFilter);
          
          const oPage = this.byId("idLegislationItemsPage") || sap.ui.getCore().byId("idLegislationItemsPage");
          
          if(oPage){
            oPage.bindProperty("title",{
              parts:[
                {value: aKeys[1] === "1" ? "Mahalli - " : "Merkez Tayinli - "},
                {path: `/LegislationCategorySet('${aKeys[0]}')/CategoryText`},
              ]
            });
          }

          this._setLegStatistic("visible", true)
        }
      },
      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */
      _refreshCompensationStatistic: function () {
        const oModel = this.getModel();
        const oInput = sap.ui.getCore().byId("idAverageIncreaseRate");

        const sPath = oModel.createKey("/CompensationRateSet", {
          Id: this.sObjectId,
        });

        oInput.setBusy(true);
        oModel.read(sPath, {
          success: () => {
            oInput.setBusy(false);
          },
          error: () => {
            oInput.setBusy(false);
          },
        });
      },
      _setDocStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/generalInformation/" + p, v);
      },
      _setBenStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/benefitsInformation/" + p, v);
      },
      _setCompStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/compensationManagement/" + p, v);
      },
      _setEmpStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/employeeInformation/" + p, v);
      },
      _setWexStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/workExperience/" + p, v);
      },
      _setLegStatistic: function (p, v = 0) {
        var oViewModel = this.getModel("detailView");
        oViewModel.setProperty("/legislation/" + p, v);
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
            dataReceived: function () {
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
            case "CompensationManagement":
              that._refreshCompensation(oPage, oContent);
              break;
            case "Legislations":
              that._loadLegislations(oPage, oContent);
              break;
            default:
              oPage.setContent(oContent);
          }
        });
      },

      _modifyPayScalePage: function (oComp) {
        var oPage = oComp
          .getAggregation("rootControl")
          .getAggregation("content")[0];
        oPage
          .removeStyleClass("sapUiContentPadding")
          .addStyleClass("sapUiNoContentPadding");
        var oPanel = oPage.getAggregation("content")[0];
        oPanel
          .removeStyleClass("sapUiContentPadding")
          .addStyleClass("sapUiNoContentPadding");
      },
      _invalidateCompensation: function () {
        return {
          busy: false,
          employeeCount: 0,
          compensationData: [],
          increaseRateAverage: null,
          saveAllowed: false,
        };
      },
      _recalculateIncreaseRate: function () {
        const oViewModel = this.getModel("detailView");
        const aComp = oViewModel.getProperty(
          "/compensationManagement/compensationData"
        );

        let dIncRateTotal = 0;
        let iCount = 0;

        aComp.forEach((oComp) => {
          if (oComp.IncreasePercentage > 0) {
            iCount++;
            dIncRateTotal =
              dIncRateTotal + parseFloat(oComp.IncreasePercentage);
          }
        });

        if (iCount > 0) {
          this._setCompStatistic(
            "increaseRateAverage",
            iCount > 0 ? parseFloat(dIncRateTotal / iCount) : null
          );
        }
      },

      _refreshCompensation: function (oPage = null, oContent = null) {
        const oModel = this.getModel();
        const oViewModel = this.getModel("detailView");

        let aFilter = [
          new Filter({
            path: "Query",
            operator: FilterOperator.EQ,
            value1: this.sObjectId,
          }),
        ];

        //--Initiate compensation data
        oViewModel.setProperty(
          "/compensationManagement",
          this._invalidateCompensation()
        );

        this.openBusyFragment();

        oModel.read("/CompensationSet", {
          filters: aFilter,
          success: (oData) => {
            this._setCompStatistic("compensationData", oData.results);
            this._setCompStatistic("employeeCount", oData.results?.length || 0);
            this._recalculateIncreaseRate();
            this.closeBusyFragment();
            if (oPage) {
              oPage.setContent(oContent);
            }
          },
          error: (oError) => {
            this.closeBusyFragment();
          },
        });
      },
      _loadLegislations: function ( oPage, oContent) {
        this._setLegStatistic("visible", false);
        oPage.setContent(oContent);
      },
      _loadPayScaleInfo: function (oApp, oPage, oContent) {
        oPage.setBusy(true);
        var aChunk = oApp?.Id.split("-") || [];
        var sRegion = null;
        if (aChunk[2] && aChunk[3]) {
          sRegion = btoa(
            JSON.stringify({
              Werks: aChunk[2],
              Btrtl: aChunk[3],
            })
          );
        }
        this.getOwnerComponent()
          .createComponent({
            usage: "scaleDisplayComponent",
            settings: {},
            componentData: {
              startupParameters: {
                RegionSelection: sRegion
                  ? {
                      0: sRegion,
                    }
                  : null,
              },
            },
            async: true,
            manifest: true,
          })
          .then(
            function (oComp) {
              oContent.setComponent(oComp);
              this._modifyPayScalePage(oComp);
              oPage.setContent(oContent);
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
