  function Slack (settings) {
      "use strict";
      var objectName = "Slack";
      
      var msgUrl = settings.getValue('SlackMsgHook');
      var usrUrl = settings.getValue('SlackUsrHook');
      var token = settings.getValue('SlackToken');
        
      var users = [];
      
      function getUsers() {
        var url = usrUrl + '?token=' + token
        var res = UrlFetchApp.fetch(url);
        var response = JSON.parse(res);
            
        response.members
          .filter(member => member.deleted == false)
          .forEach(member => users[member.profile.email] = member.id);
        }
      
      function getUserID(email) {
        if (email in users) {
          return '<@' + users[email] + '>';
        }
        
        return '';
      }
      
      function sendMessage(message){
        var msg = message;
        
        var payload = {
          "payload": '{"text": "' + slackEncode(msg) + '"}'
        };
        
        var options = {
          "method": "post",
          "payload": payload,
          "muteHttpExceptions": true
        };
        
        var res = UrlFetchApp.fetch(msgUrl, options);
        return res.getContentText();
      }
      
      function slackEncode(msg) {
        return msg.replace(/&/g,'').replace(/"/g,'\'');
      }
      
      function toString() {
        return '';
      }
      
      getUsers();  
    
      return Object.freeze({
        objectName: objectName,
        toString: toString,
        sendMessage: sendMessage,
        getUserID: getUserID
      });
    }
    