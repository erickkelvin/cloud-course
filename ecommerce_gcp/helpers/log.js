var Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

function Log(){}
Log.save = function(login, action, object, objectId = null) {
    const key = datastore.key('Log');

    var data = [
        {
            name: 'action',
            value: action
        },
        {
            name: 'object',
            value: String(object)
        },
        {
            name: 'date',
            value: formatDate(new Date())
        }
    ]
    if (login) {
        data.push({
            name: 'user',
            value: login
        });
    }
    if (objectId) {
        data.push({
            name: 'objectId',
            value: objectId
        });
    }

    var entity = {
        key: key,
        data: data
    };

    datastore
        .save(entity)
        .then(() => {
            if (objectId) {
                console.log(`${login} - ${action} - ${object} - ${objectId} - ${formatDate(new Date())}`);
            } else {
                console.log(`${login} - ${action} - ${object} - ${formatDate(new Date())}`);
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

Log.getAll = function(success, error) {

    const query = datastore.createQuery('Log');
    datastore.runQuery(query)
        .then((results) => {
            success(results[0]);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            error(err);
        });
}

function formatDate(date) {
  
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  var milli = date.getMilliseconds();

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

  return day+'/'+month+'/'+year +' '+hour+':'+minute+':'+seconds+':'+milli;
}

module.exports = Log;