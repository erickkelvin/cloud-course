var dynamoClient = require('aws-sdk').DynamoDB.DocumentClient;

function Log(){}
Log.save = function(id, action, object, objectId = null) {
    var params = {
        TableName: 'Log',
        Item: {
            User: id,
            Action: action,
            Object: object,
            Date: formatDate(new Date())
        }
    }
    if(objectId) {
        params['ObjectId'] = objectId;
    }

    dynamoClient.put(params, (err, data) => {
        if(err) { console.log(err); }
        else { console.log(data); }
    });

    if (objectId) {
        console.log(`${id} - ${action} - ${object} - ${objectId} - ${formatDate(new Date())}`);
    } else {
        console.log(`${id} - ${action} - ${object} - ${formatDate(new Date())}`);
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