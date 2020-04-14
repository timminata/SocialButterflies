function WCalendar (settings) {
  "use strict";
  var objectName = "WCalendar";
  
  var calendar = CalendarApp.getCalendarById(settings.getValue('Calendar'));
 
  function createInvite(pair) {
    var participantA = pair.A;
    var participantB = pair.B;
    
    var title = 'Pair: ' + participantA.name + ' & ' + participantB.name
    var description = settings.getValue('CalendarDescription');
    var guests = participantA.email + ',' + participantB.email;
    
    var options = {
      description: description,
      guests: guests,
      sendInvites: true};
    
    var today = new Date();
    var tomorrow = new Date(today.setDate(today.getDate()+1));
    var event = calendar.createAllDayEvent(title, tomorrow, options);
    event.setGuestsCanModify(true);
  }
  
  function toString() {
    return '';
  }
  
  return Object.freeze({
    objectName: objectName,
    toString: toString,
    createInvite: createInvite
  });
}
