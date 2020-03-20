const { model, Schema } = require('mongoose');

const courseSchema = new Schema({
	courseID: String,
	courseTitle: String,
	score: Number,
	numRate: Number,
	_id: Schema.Types.ObjectId,
})

module.exports = model('courses', courseSchema);