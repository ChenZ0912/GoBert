const Professor = require('../../models/Professor');
const Course = require('../../models/Course');
const RateSummary = require('../../models/RateSummary');
const escapeRegex = require("../../utils/escape");


module.exports = {
	ProfQuery: {
		QueryFuzzy: {
			// at first, the frontend will trigger this function
			// dependent on the number of replies, the frontend should have logic to instruct the users
			// if the length of response is 1, then call the below function directly
			// else: ask the client which one is he looking for by listing all the names
			async searchProfessorFuzzy(_, {
				query
			}, context) {
				try {
					const fuzzyProf = new RegExp(escapeRegex(query), 'gi');
					const professors = await Professor.find({
						name: fuzzyProf
					});
					return professors;
				} catch (err) {
					throw new Error(err);
				}
			}
		},
		QueryExact: {
			// if empty, means no result
			async searchProfessorExact(_, {
				query
			}, context) {
				try {
					const profStats = await RateSummary.find({
						professor: query
					});
					return profStats;
				} catch (err) {
					throw new Error(err);
				}
			}
		}
	},
	CourseQuery: {
		QueryFuzzy: {
			async searchCourseFuzzy(_, {
				query
			}, context) {
				try {
					const fuzzyQuery = new RegExp(escapeRegex(query), 'gi');
					const courses = await Course.find(
						{
							$or: [{
								courseID: fuzzyQuery
							}, {
								courseTitle: fuzzyQuery
							}]
						}
					);
					return courses;
				} catch (err) {
					throw new Error(err);
				}
			}
		},
		QueryExact: {
			// if empty, means no result
			async searchCourseExact(_, 
			{
				searchCourseInput: {
					cID,
					cTitle,
					prof
				}
			}, 
			context,
			info) {
				try {
					const courseStats = await RateSummary.find({
						courseID: cID,
						courseTitle: cTitle,
						professor: prof
					});
					return courseStats;
				} catch (err) {
					throw new Error(err);
				}
			}
		}
	}
}