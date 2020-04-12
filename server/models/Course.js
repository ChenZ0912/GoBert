const { model, Schema } = require('mongoose');

const courseSchema = new Schema({
	courseID: String,
	courseTitle: String,
	score: Number,
	numRate: Number,
	_id: Schema.Types.ObjectId,
	_total: String,
	_total_concat: String
})

module.exports = model('courses', courseSchema);