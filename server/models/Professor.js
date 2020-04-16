const { model, Schema } = require('mongoose');

const professorSchema = new Schema({
	name: String,
	score: Number,
	numRate: Number,
	firstname: String,
	lastname: String,
	_id: Schema.Types.ObjectId,
	rnumRate: Number,
	rscore: Number,
	department: String,
	wouldTakeAgain: String,
    levelOfDifficulty: Number,
    tags: [String]
})

module.exports = model('professors', professorSchema);