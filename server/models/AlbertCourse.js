const { model, Schema } = require('mongoose');

const albertCourseSchema = new Schema({
	courseID: String,
	courseTitle: String,
	numResponse: Number,
	1: Number,
	2: Number,
	3: Number,
	4: Number,
	5: Number,
	6: Number,
	7: Number,
	8: Number
})

module.exports = model('albert_courses', albertCourseSchema);