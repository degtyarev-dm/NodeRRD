var rrdtool = require('../libs/rrd/rrdtool');
var config  = require('../config').config;

exports.raw = function(req, res) {
  var rrd = req.params.rrd;
  var file = new rrdtool.RRDFile(config.rrdPath + rrd);
  var info = {};
  info.rrdFile = rrd;
  info.dsNames = file.getDSNames();
  info.rraCount = file.getRRACount();
  res.render('raw', {info:info});
}

exports.data = function(req, res) {
  var rrd = req.params.rrd;
  var file = new rrdtool.RRDFile(config.rrdPath + rrd);
  var ds = file.getDS(req.params.ds).getIdx();
  var rra = req.params.rra;
  var rowCount = file.getRRA(rra).getRowCount();
  var step = file.getRRA(rra).getStep();
  var lastUpdate = file.getLastUpdate();
  lastUpdate -= lastUpdate%step;
  var start = lastUpdate - (rowCount - 1)*step;
  var data = [];
  for (var i=0; i<rowCount; i++) {
    data[i] = [(start + i*step)*1000, file.getRRA(rra).getEl(i,ds)[0]];
  }
  res.send(data);
}

exports.fresh = function(req, res) {
  var rrd = req.params.rrd;
  var file = new rrdtool.RRDFile(config.rrdPath + rrd);
  var ds = file.getDS(req.params.ds).getIdx();
  var rra = req.params.rra;
  var step = file.getRRA(rra).getStep();
  var lastUpdate = file.getLastUpdate();
  lastUpdate -= lastUpdate%step;
  var rowCount = file.getRRA(rra).getRowCount();
  var data = [lastUpdate*1000, file.getRRA(rra).getEl(rowCount-1,ds)[0]];
  res.send(data);
}
