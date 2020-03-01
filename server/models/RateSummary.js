const { model, Schema } = require('mongoose');

const rateSummarySchema = new Schema({
	professor: String,
	courseID: String,
	courseTitle: String,
	avgProfScore: Number,
	avgCourseScore: Number,
	numRate: Number
})

module.exports = model('rate_summaries', rateSummarySchema);