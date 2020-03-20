const { model, Schema } = require('mongoose');

const professorSchema = new Schema({
	name: String,
	score: Number,
	numRate: Number,
	_id: Schema.Types.ObjectId
})

module.exports = model('professors', professorSchema);