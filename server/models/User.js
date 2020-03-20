const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	standing: String,
	major: String,
	createdAt: String,
	shoppingCart: [String]
})

module.exports = model('users', userSchema);