const { model, Schema } = require('mongoose');

const albertProfessorSchema = new Schema({
	courseID: String,
	courseTitle: String,
	numResponse: Number,
	professor: String,
	9: Number,
	10: Number,
	11: Number,
	12: Number,
	13: Number,
	14: Number,
	15: Number,
	16: Number,
	17: Number
})

module.exports = model('albert_professors', albertProfessorSchema);