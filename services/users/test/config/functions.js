var mongoose = require('mongoose');

var User = require('../../app/models/user.js');
var Config = require('./server.js');


var express = require('express');
var bodyParser = require('body-parser');

var server;
//auxiliary functions for testing
module.exports = {
	clearUsers: function(done) {
		User.remove({}, function(err, res) {
			if (err) done(err);
			else done();
		});
	},
	connectDB: function(done) {
		mongoose.connect(Config.dbUrl);
		var db = mongoose.connection;
		/*db.on('error', function(err) {
			done(err);
		});*/
		db.once('open', function() {
			done();
		});
		return db;
	},
	setupServer: function(done) {
		var app = express();
		app.use(bodyParser.json()); // get information from body
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		require('../../app/routes.js')(app);
		server = app.listen(Config.serverPort, function() {
			done();
		});
		return app;
	},
	closeServer: function() {
		if (server) server.close();
	}
}