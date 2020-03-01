const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	standing: String,
	major: String
})

module.exports = ('users', userSchema);