const { model, Schema } = require('mongoose');

const professorSchema = new Schema({
	name: String,
	score: Number,
	numRate: Number
})

module.exports = model('professors', professorSchema);