// @flow
let path =require('path');

const config = {
    root: path.normalize(__dirname + '/'),
    rootPath: process.env.ROOT_PATH,
    app: {
        name: 'Vue Test'
    },
    port: process.env.PORT || 9000,
	mongoose: {
		uri: 'mongodb://localhost:27017/aronicle5'
	}

};

module.exports = config;
