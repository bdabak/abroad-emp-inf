sap.ui.define([], function () {
  "use strict";
  var _documentTypes = {
    pdf: ["sap-icon://pdf-attachment", "#d95b5b"],
    xls: ["sap-icon://excel-attachment", "green"],
    xlsx: ["sap-icon://excel-attachment", "green"],
    xlsm: ["sap-icon://excel-attachment", "green"],
    doc: ["sap-icon://doc-attachment", "#5577c3"],
    docx: ["sap-icon://doc-attachment", "#5577c3"],
    ppt: ["sap-icon://ppt-attachment", "#eb5d0a"],
    pptx: ["sap-icon://ppt-attachment", "#eb5d0a"],
    txt: ["sap-icon://document-text", "#4d4545"],
    default: ["sap-icon://document", "#5b5b5b"],
  };

  return {
    /**
     *
     * Rounds the currency value to 2 digits
     *
     * @public
     * @param {string} sValue value to be formatted
     * @returns {string} formatted currency value with 2 digits
     */
    currencyValue: function (sValue) {
      if (!sValue) {
        return "";
      }

      return parseFloat(sValue).toFixed(2);
    },

    decideDocumentIcon: function (sExt) {
      if (
        _documentTypes[sExt] &&
        _documentTypes[sExt][0] !== undefined &&
        _documentTypes[sExt][0] !== null
      ) {
        return _documentTypes[sExt][0];
      } else {
        return _documentTypes["default"][0];
      }
    },
    decideDocumentIconColor: function (sExt) {
      if (
        _documentTypes[sExt] &&
        _documentTypes[sExt][1] !== undefined &&
        _documentTypes[sExt][1] !== null
      ) {
        return _documentTypes[sExt][1];
      } else {
        return _documentTypes["default"][1];
      }
    },
    suppressZero: function (c) {
      if (isNaN(c) || c === 0) {
        return null;
      }

      return ` (${c})`;
    },

    suppressLeadingZero: function (c) {
      try {
        if (isNaN(c) || parseInt(c, 10) === 0) {
          return null;
        }
      } catch (e) {
        return null;
      }

      return c.replace(/^0+/, "");
    },

    getIconUrl: function (sRowType, sIcon) {
      if (sIcon.includes("sap-icon://")) {
        return sIcon;
      }
      var sLibraryPath = jQuery.sap.getModulePath("com.thy.ux.abroadempinf"); //get the server location of the app

      return sLibraryPath + "/style/assets/flags/" + sIcon + ".svg";
    },
  };
});
