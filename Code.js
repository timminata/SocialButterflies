var FREQUENCY = {
  DAILY: 1,
  WEEKLY: 2,
  PAUSED: 3,
};

var SHEET_DATA = "Data";

//return all participants from the Sheet_Data
function getParticipants() {
  var range = "A2:D";
  var rangeValues = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(SHEET_DATA)
    .getRange(range)
    .getValues();
  var participants = [];

  rangeValues.forEach((row) => {
    if (row[1] != "") {
      participants.push(new Participant(row));
    }
  });

  return participants;
}

function getTeams(participants) {
  var teams = [];

  participants.forEach((p) => {
    var t = p.team;
    var n = p.name;
    if (!(t in teams)) {
      teams[t] = [];
    }

    teams[t].push(p);
  });

  return teams;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//look up user id from the slack user list by email 
function getSlackUserID (participant, slack) {
  var id = slack.getUserID(participant.email);
  if (id == '') { id = participant.toString(); }
  return id;
}

//turn two participant pairs into a pretty string
function pairToString (pair, slack) {
  var pA = pair.A;
  var pB = pair.B;
  
  var pAID = getSlackUserID(pA, slack);
  var pBID = getSlackUserID(pB, slack);
  
  return 'Pair: ' + pAID + ' - ' + pBID;
}

//main function. get all participants and pair them up. 
//it'll for the most part respect teams and not pair people of the same team unless not otherwise possible
function createMatches(freq) {
  var settings = new Settings();
  
  //find all participants & filter by frequency
  //==============================
  var participants = getParticipants().filter(participant => participant.doesPartake(freq));
  console.log('Participants: ' + participants.length);

  //split participants into teams
  //==============================
  var teams = getTeams(participants);

  //create two lists. fill up first list until ~ half the participants are in it
  //matches will be done between the two lists (randomly shuffled), making sure that team members don't meet in this step
  //==============================
  var listA = [];
  var listB = [];

  var middle = parseInt(participants.length / 2);
  
  for (var t in teams) {
   var team = teams[t];
    if (listA.length < middle) {
      team.forEach(participant => listA.push(participant));
    } else {
      team.forEach(participant => listB.push(participant));
    }
  };

  //randomize lists so we can just pair people from the two lists easily
  //==============================
  shuffleArray(listA);
  shuffleArray(listB);

console.log('ListA: ' + listA.length);
console.log('ListB: ' + listB.length);

  //Pair participants from the top
  //==============================
  var pairs = [];
  while (listA.length > 0) {
    //stop if one list is empty
    if (listB.length == 0) {
      break;
    }

    pairs.push({ A: listA.pop(), B: listB.pop() });
  }

  //mob up the remaining participants 
  listB.forEach(participant => listA.push(participant));

  //pair the remaining participants from the top - at this point people from the same team could meet
  while (listA.length > 1) {
    pairs.push({ A: listA.pop(), B: listA.pop() });
  }

  //send em to Slack
  //==================
console.log('creating slack message');
  var slack = new Slack(settings);
  var message = [];

  message.push(settings.getValue('SlackMessage'));
  message.push('Participants ['  + fToS(freq) + ']: ' + participants.length);
  pairs.forEach(pair => message.push(pairToString(pair, slack)));
  
  //was anyone left out? 
  if (listA.length == 1) {
    var leftover = listA.pop();
    message.push(settings.getValue('SlackLeftOver1') + getSlackUserID(leftover, slack) + settings.getValue('SlackLeftOver2'));
  }

console.log('sending slack message');
  slack.sendMessage(message.join('\n'));
  
  //create calendar invites
  //========================
console.log('creating calendar');
  
  var cal = new WCalendar(settings);
console.log('creating events');
  
  pairs.forEach(pair => cal.createInvite(pair));
console.log('done');
}

function fToS (freq) {
  switch (freq) {
    case FREQUENCY.DAILY: 
      return 'Daily';
    case FREQUENCY.WEEKLY:
      return 'Weekly';
    case FREQUENCY.PAUSED:
      return 'Paused';
    default:
      return 'na';
  }
}

//function to create custom menu items in the google sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('SocialButterflies')
  .addItem('Run Daily', 'runDaily')
  .addSeparator()
  .addItem('Run Weekly', 'runWeekly')
  .addToUi();
}

function runDaily() {
  createMatches(FREQUENCY.DAILY);
//  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
//     .alert('Run complete');
}

function runWeekly() {
  createMatches(FREQUENCY.WEEKLY);
//  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
//     .alert('You clicked the second menu item!');
}


