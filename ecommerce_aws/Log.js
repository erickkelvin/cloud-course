var dynamo = require('aws-sdk').DynamoDB;

function Log(){}
Log.save = function(userId, action, object, objectId) {
  if (objectId) {
    console.log(`${userId} - ${action} - ${object} - ${objectId} - ${formatDate(new Date())}`);
  } else {
    console.log(`${userId} - ${action} - ${object} - ${formatDate(new Date())}`);
  }
}

function formatDate(date) {
  
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  if(day < 10) {
      day = '0' + day;
  }
  if(month < 10) {
      month = '0' + month;
  }
  if(hour < 10) {
      hour = '0' + hour;
  }
  if(minute < 10) {
      minute = '0' + minute;
  }
  if(seconds < 10) {
      seconds = '0' + seconds;
  }

  return day+'/'+month+'/'+year +' '+hour+':'+minute+':'+seconds;
}

module.exports = Log;