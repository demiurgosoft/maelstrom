/*
Name: Databas Handler - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for db Handler
*/

var assert = require('chai').assert;
var async = require('async');

var data = require('./config/data');
var dbHandler = require('../app/dbhandler.js');
var tables = dbHandler.tables;


/*var auxFunc = require('./config/functions.js');


var data = require('./config/data.js');
var Models = dbHandler.models;*/


describe('Database Handler', function() {
	this.timeout(2000);
	before(function(done) {
		this.timeout(9000);
		dbHandler.dropTables(function(err, res) {
			assert.notOk(err);
			dbHandler.createTables(function(err, res) {
				assert.notOk(err);
				done();
			});
		});
	});
	beforeEach(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			done();
			//insert data
		});
	});
	after(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			done();
		});
	});

	it('Insert and Get User', function(done) {
		var user = data.users.arthur;
		var user2 = data.users.ford;
		assert.ok(user);
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(res, true);
			dbHandler.insert.user(user2.id, user2, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res, true);
				dbHandler.insert.user(user.id, user, function(err, res) {
					assert.ok(err);
					assert.strictEqual(res, false);
					dbHandler.get.all(tables.users, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						dbHandler.get.user(user.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.strictEqual(res[0].id, user.id);
							assert.strictEqual(res[0].money, user.money);
							dbHandler.get.user("11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('User Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.users), function(key, callback) {
				if (data.users.hasOwnProperty(key)) {
					var user = data.users[key];
					var isCorrect = user.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.user(user.id, user, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.strictEqual(res, true);
						} else assert.strictEqual(res, false);
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.users, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get City', function(done) {
		var city = data.cities.minasTirith;
		var city2 = data.cities.isengard;
		dbHandler.insert.city(city, function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res, true);
			dbHandler.insert.city(city2, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res, true);
				dbHandler.insert.city(city2, function(err, res) {
					assert.ok(err);
					assert.strictEqual(res, false);
					dbHandler.get.all(tables.cities, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						city = res[0];
						dbHandler.get.byId(tables.cities, city.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.ok(res[0].id);
							assert.strictEqual(res[0].name, city.name);
							assert.strictEqual(res[0].position_x, city.position_x);
							assert.strictEqual(res[0].position_y, city.position_y);
							dbHandler.get.byId(tables.cities, "11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('City Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.cities), function(key, callback) {
				if (data.cities.hasOwnProperty(key)) {
					var city = data.cities[key];
					var isCorrect = city.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.city(city, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.strictEqual(res, true);
						} else assert.strictEqual(res, false);
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.cities, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get Product', function(done) {
		var product = data.products.bread;
		var product2 = data.products.redmeat;
		dbHandler.insert.product(product, function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res, true);
			dbHandler.insert.product(product2, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res, true);
				dbHandler.insert.product(product2, function(err, res) {
					assert.ok(err);
					assert.strictEqual(res, false);
					dbHandler.get.all(tables.products, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						product = res[0];
						dbHandler.get.byId(tables.products, product.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.ok(res[0].id);
							assert.strictEqual(res[0].name, product.name);
							assert.strictEqual(res[0].base_price, product.base_price);
							assert.strictEqual(res[0].base_consumption, product.base_consumption);
							assert.strictEqual(res[0].base_production, product.base_production);
							assert.strictEqual(res[0].weight, product.weight);
							dbHandler.get.byId(tables.products, "11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Product Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.products), function(key, callback) {
				if (data.products.hasOwnProperty(key)) {
					var product = data.products[key];
					var isCorrect = product.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.product(product, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.strictEqual(res, true);
						} else assert.strictEqual(res, false);
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.products, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get Ship Model', function(done) {
		var ship = data.ships.galleon;
		assert.ok(ship);
		dbHandler.insert.shipModel(ship, function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res, true);
			dbHandler.insert.shipModel(ship, function(err, res) {
				assert.ok(err);
				assert.strictEqual(res, false);
				dbHandler.get.all(tables.shipModels, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.length, 1);
					var shipId = res[0].id;
					dbHandler.get.byId(tables.shipModels, shipId, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.ok(res[0]);
						assert.strictEqual(res[0].id, shipId);
						assert.strictEqual(res[0].name, ship.name);
						assert.strictEqual(res[0].life, ship.life);
						assert.strictEqual(res[0].speed, ship.speed);
						assert.strictEqual(res[0].price, ship.price);
						assert.strictEqual(res[0].cargo, ship.cargo);
						done();
					});
				});
			});
		});
	});
	it('Ship Model Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.ships), function(key, callback) {
				if (data.ships.hasOwnProperty(key)) {
					var ship = data.ships[key];
					var isCorrect = ship.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.shipModel(ship, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.strictEqual(res, true);
						} else assert.strictEqual(res, false);
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.shipModels, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get User Ship', function(done) {
		var ship = data.userShips.blackPearl;
		var user = data.users.arthur;
		var model = data.ships.galleon;
		assert.ok(ship);
		assert.ok(user);
		assert.ok(model);
		dbHandler.insert.userShip(user.id, ship, function(err, res) {
			assert.ok(err); //foreign id not valid
			assert.strictEqual(res, false);
			dbHandler.insert.user(user.id, user, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				dbHandler.insert.shipModel(model, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					dbHandler.insert.userShip(user.id, ship, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res, true);
						dbHandler.get.userShips(user.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							var shipId = res[0].id;
							dbHandler.get.shipDetails(user.id, shipId, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 1);
								assert.strictEqual(res[0].id, shipId);
								assert.strictEqual(res[0].name, ship.name);
								assert.strictEqual(res[0].model, ship.model);
								assert.strictEqual(res[0].user_id, user.id);
								assert.strictEqual(res[0].status, ship.status);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('User Ship Validation', function(done) {
		var correctElements = 0;
		var user = data.users.arthur;
		var model = data.ships.galleon;
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			dbHandler.insert.shipModel(model, function(err, res) {
				assert.notOk(err);
				assert.ok(res);


				async.each(Object.keys(data.userShips), function(key, callback) {
						if (data.userShips.hasOwnProperty(key)) {
							var ship = data.userShips[key];
							var isCorrect = ship.correct;
							if (isCorrect === true) correctElements++;
							dbHandler.insert.userShip(user.id, ship, function(err, res) {
								if (isCorrect) {
									assert.notOk(err);
									assert.strictEqual(res, true);
								} else assert.strictEqual(res, false);
								callback();
							});
						}
					},
					function(err) {
						assert.notOk(err);
						dbHandler.get.all(tables.userShips, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.length, correctElements);
							done();
						});
					});
			});
		});
	});
	it.skip('Insert and Get Ship Product', function(done) {
		done(new Error("Not implemented"));
	});
	it.skip('Insert and Get City Product', function(done) {
		done(new Error("Not implemented"));
	});

});