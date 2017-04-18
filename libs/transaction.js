var ed25519 = require('ed25519');
var bs58 = require('bs58')
var http   = require('../libs/http');

module.exports = {

	sendTo:function (pubKey,secretKey, recipient,amount, cb) {
		var cmd = '/lightwallet/getraw/31/'+pubKey+'?feePow=2&recipient='+recipient+'&amount='+amount+'&key=1';
		//Отсылаем на сервер запрос на создание транзакции
		http.getErmData('GET',cmd,null,function (message) {
			return cb(message)
			var byteMessage = bs58.decode(message)
			var signature = ed25519.Sign(byteMessage, bs58.decode(secretKey));
			var slice1 = byteMessage.slice(0,53)
			var slice2 = byteMessage.slice(53,byteMessage.length)
			var messageBuf = Buffer.concat([slice1,signature, slice2]);
			var cmd = '/lightwallet/parse?data='+bs58.encode(messageBuf)
			//Подписываем транзакцию
			http.getErmData('GET',cmd,'',function (data) {
				cb(data);
			})

		});

	},




}


