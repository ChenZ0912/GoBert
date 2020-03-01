const Professor = require('../../models/Professor');
const Course = require('../../models/Course');
const RateSummary = require('../../models/RateSummary');
const escapeRegex = require("../../utils/escape");
const Teach = require('../../models/Teach');


module.exports = {
	CourseQuery: {
		GetCourse: {
			async getCourse(_, {
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
		GetCourseDetail: {
			async getCourseDetail(_,
			{
				searchCourseInput: {
					cID,
					cTitle
				}
			}, 
			context,
			info){
				try {
                    var course = await Course.findOne({
                        courseID: cID,
                        courseTitle: cTitle,
                    })
					const sections = await Teach.find({
						courseID: cID,
						courseTitle: cTitle,
					});

                    var courseStats = [];
					for (let i = 0; i < sections.length; i++) {
						const prof = sections[i]['professor'];
                        const rating = await RateSummary.findOne({
                            courseID: cID,
                            courseTitle: cTitle,
                            professor: prof
                        });

                        if (!rating) {
                            rating = {
                                'courseID': cID,
                                'courseTitle': cTitle,
                                'avgProfScore': 0.0,
                                'avgCourseScore': 0.0,
                                'numRate': 0,
                                'professor': prof
                            }
                        }
                        courseStats.push(rating);
                    }

                    course['ratings'] = courseStats;
                    return course;
				} catch (err) {
				  throw new Error(err);
				}
			}
		},

		QuerySectionExact: {
			// if empty, means no result
			async searchSectionExact(_, 
			{
				searchSectionStatInput: {
					cID,
					cTitle,
					prof
				}
			}, 
			context,
			info) {
				try {
					const stats = await RateSummary.find({
						courseID: cID,
						courseTitle: cTitle,
						professor: prof
					});
					return stats;
				} catch (err) {
					throw new Error(err);
				}
			}
		}
	}
}