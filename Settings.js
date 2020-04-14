var SHEET_SETTINGS = 'Settings';

function Settings () {
  "use strict";
  var objectName = "Settings";
  var values = [];
  
  var range = "A2:B";
  var rangeValues = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName(SHEET_SETTINGS)
  .getRange(range)
  .getValues();
  
  rangeValues.filter(row => row[0] > '')
  .forEach(row => values[row[0]] = row[1]);
  
  function getValue(key) {
    if (key in values) {
      return values[key];
    }
    
    return 'n/a';
  }
  
  return Object.freeze({
    objectName: objectName,
    getValue: getValue
  });
}

