/**
 * Wallet model mongodb
 *
 */
let mongoose = require('../libs/mongoose');
let bcrypt   =require('bcrypt-nodejs');

// define the schema for our user model
let walletSchema = mongoose.Schema({
	created: { type: Date, default: Date.now },
	password:String,
	seed:{type:String, required:[true,'Seed required']},
	privatekey:String,
	openkey:String
});

// methods ======================
// generating a hash
walletSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
walletSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Wallet', walletSchema);