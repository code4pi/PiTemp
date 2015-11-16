var express = require('express');
var app = express();
var config = require('./config');
var dateInterval = require('./dateInterval');
var rrd = require('rrd');
var fs = require('fs');
var moment = require('moment');

var filename = config.filename;

if (!checkFileExist(filename)) {
  var createArgs = [];
  for (var i = 0; i < config.w1.length; i++) {
    createArgs.push('DS:' + config.w1[i].id + ':GAUGE:600:0:60');
  }
  createArgs.push('RRA:AVERAGE:0.5:1:288');
  createArgs.push('RRA:AVERAGE:0.5:12:168');
  createArgs.push('RRA:AVERAGE:0.5:288:365');
  rrd.create(filename, 300, getCurrentTime() - 300, createArgs, function(error) {
    if (error) {
      console.log("Error:", error);
      process.exit(1);
    }
    updateNow();
  });
} else {
  updateNow();
}

function updateNow() {
  var temps = {};
  for (var i = 0; i < config.w1.length; i++) {
    var data = fs.readFileSync(config.w1[i].path);
    var temp = parseFloat(data.toString('ascii').match(/t=([0-9]+)/)[1]) / 1000;
    temps[config.w1[i].id] = temp;
  }
  rrd.update(filename, [getCurrentTime(), temps], function(error) {
    if (error !== null) {
      console.error(error);
    }
  });
}

function checkFileExist(path) {
  try {
    var stats = fs.statSync(filename);
    return stats.isFile();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}

function getCurrentTime() {
  return Math.ceil((new Date).getTime() / 1000) - (Math.ceil((new Date).getTime() / 1000) % (60 * 5));
}

setInterval(updateNow, 5 * 60 * 1000);

app.use(express.static('public'));

app.get('/getData', function(req, res) {
  var result = [];
  for (var i = 0; i < config.w1.length; i++) {
    result.push({
      id: config.w1[i].id,
      name: config.w1[i].name,
      data: [],
      color: config.w1[i].color
    });
  }

  rrd.fetch(filename, {
    cf: "AVERAGE",
    start: dateInterval[req.query.interval].start(),
    end: moment().unix(),
    resolution: dateInterval[req.query.interval].resolution
  }, function(time, value) {

    if (time == null) {
      res.json(result);
      return;
    }

    for (var i = 0; i < result.length; i++) {
      result[i].data.push({
        date: time,
        measure: value[result[i].id]
      });
    }
  }, '-a');
});

var server = app.listen(config.http.port, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('PiTemp app listening at http://%s:%s', host, port);

});
