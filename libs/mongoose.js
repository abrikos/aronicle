/**
 * Created by abrikos on 06.03.17.
 */
let mongoose = require('mongoose');
let config   =require('../config');
let log   = require('./log')(module);

//let options = { promiseLibrary: require('q') };
//let db = mongoose.createConnection(config.mongoose.uri, options);
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoose.uri);
let db = mongoose.connection;

db.on('error', function (err) {
	log.error('connection error:', err.message);
});
db.once('open', function callback () {
	log.info("Connected to DB!");
});

module.exports = mongoose;
