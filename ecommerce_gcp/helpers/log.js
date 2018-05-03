var Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

function Log(){}
Log.save = function(login, action, object, objectId = null) {
    const key = datastore.key('Log');
    const datetime = formatDate(new Date());

    var data = [
        {
            name: 'user',
            value: login
        },
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
            value: datetime
        }
    ]
    if (objectId) {
        data.push({
            name: 'objectId',
            value: objectId
        })
    }

    var entity = {
        key: key,
        data: data
    };

    datastore
        .save(entity)
        .then(() => {
            if (objectId) {
                console.log(`${login} - ${action} - ${object} - ${objectId} - ${datetime}`);
            } else {
                console.log(`${login} - ${action} - ${object} - ${datetime}`);
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
  
  var day = date.getUTCDate();
  var month = date.getUTCMonth();
  var year = date.getUTCFullYear();
  var hour = date.getUTCHours();
  var minute = date.getUTCMinutes();
  var seconds = date.getUTCSeconds();
  var milli = date.getUTCMilliseconds();

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