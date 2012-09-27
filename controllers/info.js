var rrdtool = require('../libs/rrd/rrdtool');
var config  = require('../config').config;
var fs      = require('fs');

exports.info = function(req, res) {
  var rrd = req.params.rrd;
  var file = new rrdtool.RRDFile(config.rrdPath + rrd);
  var info = {};
  info.rrdFile = rrd;
  info.lastUpdate = file.getLastUpdate();
  info.minStep = file.getMinStep();
  var dsNames = file.getDSNames();
  var rraCount = file.getRRACount();
  info.dsList = [];
  for (var i in dsNames) {
  	info.dsList.push({
      name: dsNames[i], 
      type: file.getDS(dsNames[i]).getType()
    });
  }
  info.rraList = [];
  for (var i=0; i<rraCount; i++) {
  	info.rraList[i] = { 
  		rows: file.getRRA(i).getRowCount(),
  		step: file.getRRA(i).getStep()
  	}
  }
  res.render('info',{info:info});
}