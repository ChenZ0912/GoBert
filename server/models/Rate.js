const { model, Schema } = require('mongoose');

const rateSchema = new Schema({
	username: String,
	courseTitle: String,
	courseID: String,
	courseScore: Number,
	term: String,
	anonymity: Boolean,
	professor: String,
	professorScore: Number,
	comment: String,
	upvotes: [String],
	downvotes: [String],
	createdAt: String
})

module.exports = model('rates', rateSchema);