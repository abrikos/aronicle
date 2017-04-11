let log   = require('../libs/log')(module);


module.exports.controller = function(app) {
	app.get('/', (req, res, next) => {
		let flash = req.flash();
		//In TEMPLATE: page - highlight current, user - for cabinet, flash - to alert
		res.render('index', {
			page: '/',
			user: req.session.email,
			flash:flash.error ? flash.error[0] : '',
		});

	});

};
