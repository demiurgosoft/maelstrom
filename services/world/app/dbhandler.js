/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/


module.exports = {
	models: {
		City: require('./models/city.js'),
		Product: require('./models/product.js'),
		User: require('./models/user.js'),
		Ship: require('./models/ship.js')
	},
	getShip: function(userId, shipId, done) {
		this.models.User.findOne(userId, {
			ships: {
				$elemMatch: {
					_id: shipId
				}
			}
		}, function(err, res) {
			if (!res) done(err, null);
			else if (!res.ships) done(err, null);
			else done(err, res.ships[0]);
		});
	},
	/*updateShip: function(userId, shipId, changes, done) {
		this.models.User.update({_id: userId,'ships._id':shipId},{$set:{'ships.$.'+key:value}},function(err,res){
			if(res.nModified===1) done(err,true);
			else done(err,false);	
		});
	},*/
	addShip: function(userId, ship, done) {
		if (!ship || !ship.name) done(new Error("Not valid ship data"), false);
		else {
			//Check if ship with same name already exists
			this.models.User.findOne(userId, function(err, res) {
				if (err || !res) done(err, false);
				else {
					res.ships.push(ship);
					res.save(function(err, res) {
						if (res) done(err, true);
						else done(err, false);
					});
				}
			});
		}
	},
	getCityProduct: function(cityId, productId, done) {
		this.models.City.findOne({
			_id: cityId
		}, {
			products: {
				$elemMatch: {
					_id: productId
				}
			}
		}, function(err, res) {
			if (!res) done(err, null);
			else if (!res.products) done(err, null);
			else done(err, res.products[0]);
		});
	},
	removeMoney: function(userId, quantity, done) {
		if (quantity < 0.0) done(new Error("Negative Quantity"), false);
		else {
			this.models.User.findById(userId, function(err, user) {
				if (err) done(err, false);
				else if (!user) done(new Error("User not found"), false);
				else {
					if (user.money < quantity) done(null, false);
					else {
						user.money -= quantity;
						user.save(function(err) {
							if (err) done(err, false);
							else done(null, true);
						});
					}
				}
			});
		}
	},
	addMoney: function(userId, quantity, done) {
		if (quantity < 0.0) done(new Error("Negative Quantity"), false);
		else {
			this.models.User.findById(userId, function(err, user) {
				if (err) done(err, false);
				else if (!user) done(new Error("User not found"), false);
				else {
					user.money += quantity;
					user.save(function(err) {
						if (err) done(err, false);
						else done(null, true);
					});
				}
			});
		}
	},
	isCity: function(cityId, done) {
		this.models.City.count({
			_id: cityId
		}, function(err, count) {
			if (count > 0) done(err, true);
			else done(err, false);
		});
	},
	isProduct: function(productId, done) {
		this.models.Product.count({
			_id: productId
		}, function(err, count) {
			if (count > 0) done(err, true);
			else done(err, false);
		});
	},
	isShipModel: function(shipId, done) {
		this.models.Ship.count({
			_id: shipId
		}, function(err, count) {
			if (count > 0) done(err, true);
			else done(err, false);
		});
	},
	isUser: function(userId, done) {
		this.models.User.count({
			_id: userId
		}, function(err, count) {
			if (count > 0) done(err, true);
			else done(err, false);
		});
	}
};