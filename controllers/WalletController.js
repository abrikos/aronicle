var log   = require('../libs/log')(module);
var http   = require('../libs/http');
var Walvar  = require('../models/WalletModel');
var request = require("request");
var crypto = require("crypto");
var uuid = require("uuid");
var ed25519 = require('ed25519');
var bs58 = require('bs58')
var nacl = require('tweetnacl')

module.exports.controller = function(app) {

/*
	app.get('/wallet/open',function (req,res) {
		var flash = req.flash();
		res.render('wallet-open',{route:req.url, flash:flash.error ? flash.error[0] : '', auth:req.session.wallet_id});
	});

	app.get('/wallet/restore',function (req, res, next) {
		var flash = req.flash();
		res.render('wallet-restore',{route:req.url, flash:flash.error ? flash.error[0] : '', auth:req.session.wallet_id});
	});

	app.post('/wallet/restore',function (req, res, next) {
		"use strict";
		//return res.status(500).send('Something broke!');
		return next(new Error('TODO: процедура восстановления кошелька по имеющемуся SEED'));
	});

	app.get('/wallet/unlock',function (req, res, next) {
		"use strict";
		var cmd;
		//cmd = '/payment?feePow=0&assetKey=2&sender=7F9cZPE1hbzMT21g96U8E1EfMimovJyyJ7&recipient=7JU8UTuREAJG2yht5ASn7o1Ur34P1nvTk5&amount=0.1&password=123456789011'
		cmd = '/wallet';
		getErmData('GET',cmd,{seed:"",password:"",recover:false,amount:1},function (data) {
			res.send(data)
		});
	});

	app.post('/wallet/open',function (req,res,next) {
		var fs = require('fs');
		var password = req.body.password;
		var jsonfile = require('jsonfile');
		var filePath = '/tmp/' + uuid.v4();
		req.files.jsonfile.mv(filePath, function(err) {
			if (err)
				return next(new Error(err.message));
			jsonfile.readFile(filePath, function(err, key) {
				fs.unlinkSync(filePath);
				if (err)
					return next(new Error('Не верный JSON формат'));
				Wallet.findOne({seed:key.seed},function (err,wallet) {
					if (err)
						return next(new Error('Ошибка  SEED в JSON файле'));
					if (!wallet.validPassword(password)) {
						log.info('pass not match');
						req.flash('error', 'Пароль не верный.')
						return res.redirect('/wallet/open');
					}
					getErmData('POST','/wallet/unlock',{password:'aaaaaaaaaaa'},function (data) {
						"use strict";
						log.info('Try unlock wallet: ' + data);
						data = {exists:true, isunlocked:true};
						log.info(data)
						if(!data.exists)
							return next(new Error('Кошелек не найден в ERM'));
						if(!data.isunlocked)
							return next(new Error('Кошелек не разблокирован в ERM'));
						req.session.wallet_id = wallet.id;
						req.session.save(function (err) {
							if (err) {
								return next(new Error('Ошибка сохранения сессии'));
							}
							log.info('Check session',req.session);
							return res.redirect('/wallet/dashboard');
						});

					});
				});
			})
		});
	});

	app.get('/wallet/cabinet',authenticateWallet,function (req, res, next) {
		Wallet.findById(req.session.wallet_id,function (err, wallet) {
			log.info(req.session)
			res.render('wallet-dashboard',{
				route:req.url,
				auth:true,
				privatekey:wallet.privatekey,
				openkey:wallet.openkey,
				seed:wallet.seed
			});
		})

	})


	app.get('/wallet/new',function (req, res) {
		"use strict";
		res.render('wallet-new',{route:req.url, auth:req.session.wallet_id})
	});

	app.get('/wallet/created',function (req, res) {
		res.render('wallet-created',{route:req.url, auth:req.session.wallet_id});
	});

	app.get('/wallet/download',authenticateWallet, function (req, res) {
		Wallet.findById(req.session.wallet_id,function (err,wallet) {
			if(err)
				return next(new Error('Кошелёк для скачивания не найден'));
			res.setHeader('Content-disposition', 'attachment; filename=aronicle.json');
			res.setHeader('Content-type', 'text/json');
			res.charset = 'UTF-8';
			var data = JSON.stringify({
				seed:wallet.seed,
				openkey:wallet.openkey,
				privatekey:wallet.privatekey
			});
			res.write(data);
			res.end();
		})
	});

	app.post('/wallet/new',function (req, res,next) {
		var base58 = require('base58');
		var postData = {
			seed:req.body.seed,
			password:req.body.password,
			recover:false,
			amount:2
		};
		getErmData('POST','/wallet',postData,function (data) {
			if(!postData.seed){
				//TODO get new seed from ERM
				postData.seed = uuid.v4();
			}
			Wallet.findOne({ 'seed' :  postData.seed }, function(err, wallet) {
				"use strict";
				if (err)
					return next(new Error('Ошибка поиска кошелька: ' + err.message));
				if (wallet) {
					return next(new Error('Кошелек уже создан'));
				} else {
					var newWalvar            = new Wallet();
					newWallet.seed = postData.seed;
					newWallet.privatekey = uuid.v4();
					newWallet.openkey = uuid.v4();
					newWallet.password = newWallet.generateHash(postData.password);
					// save the user
					newWallet.validate(function(err) {
						if (err){
							err.errors.forEach(function (error) {
								req.flash('error', error.message);
							});
							log.info('Error validate wallet')
							return res.redirect('/');
						}
						newWallet.save(function (err) {
							if (err)
								throw err
							log.info('Walvar saved: ', newWallet.id)
							req.session.wallet_id = newWallet.id;
							req.session.save(function (err) {
								if (err) {
									throw err
								}
								log.info('Check session',req.session)
								return res.redirect('/wallet/created');
							});

						})
					});
				}

			});

		})
	});
*/

	app.get('/wallet/blocks',function (req,res) {
		getErmData('GET','/blocks/height',{},function (data) {
			var height = data - 100;
			getErmData('GET','/blocks/fromheight/'+height,{},function (data) {
				res.render('wallet-blocks', {data: data.reverse(), route: req.url, auth: req.session.wallet_id ? true : false})
			});
		})
	});


	var pub = 'GJPyYyPA89cXeue6F6eUN4VyDjKtLckRDsqZYAy2BxuK';
	var prv = '54XtxGCDFxGLbnfnPWNbfe3ap9CApXsJUmcmDFAujGmqoSPZtnX7jg5snhyotg2c7BE2awbeFeJqrSUAv7UB5zyb';
	//var aliceSeed = crypto.randomBytes(32);
	//var aliceKeypair = ed25519.MakeKeypair(aliceSeed);

	//var cmd =
	// '/lightwallet/getraw/31/'+bs58.encode(aliceKeypair.publicKey)+'?feePow=2&recipient=77QnJnSbS9EeGBa2LPZF dfd df df  fdfdf dfgf f'
	var cmd = '/lightwallet/getraw/31/'+pub+'?feePow=2&recipient=77QnJnSbS9EeGBa2LPZFZKVwjPwzeAxjmy&amount=123.0000123&key=1'

	http.getErmData('GET',cmd,null,function (message) {
		var byteMessage = bs58.decode(message)
		var signature = ed25519.Sign(byteMessage, bs58.decode(prv));
		var b1 = byteMessage.slice(0,53)
		var b2 = byteMessage.slice(53,byteMessage.length)
		var readyMessage = Buffer.concat([b1,signature, b2]);

		console.log(byteMessage)

		console.log(signature)
		cmd = '/lightwallet/parse?data='+bs58.encode(readyMessage)
		console.log(cmd)
		http.getErmData('GET',cmd,'',function (data) {
			console.log(data);
		})

	});


	//Check if the Walvar authenticated and add permissions to next
	function authenticateWalvar (req, res, next) {
		log.info(req.session)
		Wallet.findById(req.session.wallet_id,function (err,wallet) {
			"use strict";
			if(err) {
				return next(new Error('Model error'+err.message));
			}
			if(!wallet)
				return res.redirect('/');
			return next();
		});
	}

};


