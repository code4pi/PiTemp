var dateInterval = module.exports = {};
var moment = require('moment');

dateInterval.day = {
    resolution : 300,
    start : function () {
      return moment().subtract(1, 'days').unix();
    }
};

dateInterval.week = {
    resolution : 3600,
    start : function () {
      return moment().subtract(7, 'days').unix();
    }
};

dateInterval.month = {
  resolution : 3600 * 24,
  start : function () {
    return moment().subtract(1, 'month').unix();
  }
};

dateInterval.year = {
    resolution : 3600 * 24,
    start : function () {
        return moment().subtract(1, 'year').unix();
    }
};

module.exports = dateInterval;
