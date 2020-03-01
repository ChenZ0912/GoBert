const { model, Schema } = require('mongoose');

const courseSchema = new Schema({
	courseID: String,
	courseTitle: String,
	score: Number,
	numRate: Number
})

module.exports = model('courses', courseSchema);