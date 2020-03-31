const { model, Schema } = require('mongoose');

const sectionSchema = new Schema({
	courseID: String,
	courseTitle: String,
	term: String,
	classNo: String,
	daystimes: String,
	location: String,
	room: String,
	status: String,
	professor: String
})

module.exports = model('sections', sectionSchema);