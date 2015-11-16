var config = module.exports = {};

config.http = {};
config.http.port = 8080;

config.filename = 'PiTemp.rrd';

config.w1 = [{
  id: '28-00042c32c1ab',
  path: '/sys/bus/w1/devices/28-00042c32c1ff/w1_slave',
  name: 'Chambre',
  color: '#081D58'
}, {
  id: '28-00042c32c1aa',
  path: '/sys/bus/w1/devices/28-00042c32c1aa/w1_slave',
  name: 'Salon',
  color: '#B1221C'
}];



module.exports = config;
