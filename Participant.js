var COL_NAME = 0;
var COL_TEAM = 1;
var COL_FREQUENCY = 2;
var COL_EMAIL = 3;

function Participant (row) {
    "use strict";
  var objectName = "Participant";
  var frequency = FREQUENCY.PAUSED;
  
  switch (row[COL_FREQUENCY].toLowerCase()) {
    case 'daily':
      frequency = FREQUENCY.DAILY;
      break;
    case 'weekly': 
      frequency = FREQUENCY.WEEKLY;
      break;
    default: 
      frequency = FREQUENCY.PAUSED;
  }
  
  var name = row[COL_NAME];
  var email = row[COL_EMAIL];
  var team = row[COL_TEAM];
  
  function print() {
    // code here
    console.log(name + ' (' + team + ')');
  }
  
  function toString() {
    return name + ' (' + team + ')';
  }
  
  function doesPartake(freq) {
    //partake if not paused
    //partake in daily if daily or weekly
    //partake in weekly if only weekly
    switch (frequency) {
      case FREQUENCY.PAUSED:
        return false;
      case FREQUENCY.WEEKLY:
        return freq == FREQUENCY.WEEKLY;
      case FREQUENCY.DAILY:
        return (freq == FREQUENCY.DAILY) || (freq == FREQUENCY.WEEKLY);
      default:
        return false;
    }
  }
  
  return Object.freeze({
    objectName: objectName,
    print: print,
    toString: toString,
    doesPartake: doesPartake,
    team: team,
    name: name,
    email: email,
    frequency: frequency
  });
}
