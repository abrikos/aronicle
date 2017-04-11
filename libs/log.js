/**
 * Created by abrikos on 06.03.17.
 */
var winston = require('winston');

function getLogger(module) {
	var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

	return new winston.Logger({
		transports : [
			new winston.transports.Console({
				colorize:   true,
				level:      'debug',
				label:      path
			})
		]
	});
}
module.exports = getLogger;