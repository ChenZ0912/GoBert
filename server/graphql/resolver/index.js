const searchProfessorResolvers = require('./searchProfessor');
const searchCourseResolvers = require('./searchCourse');


module.exports = {
	Query: {
		...searchProfessorResolvers.ProfQuery.GetProfessorByName,
		...searchProfessorResolvers.ProfQuery.GetProfessorDetail,
		...searchCourseResolvers.CourseQuery.GetCourse,
		...searchCourseResolvers.CourseQuery.GetCourseDetail,
	}
}