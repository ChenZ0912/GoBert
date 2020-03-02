const searchProfessorResolvers = require('./searchProfessor');
const searchCourseResolvers = require('./searchCourse');
const usersResolvers = require('./users');

module.exports = {
	Query: {
		...searchProfessorResolvers.ProfQuery.GetProfessorByName,
		...searchProfessorResolvers.ProfQuery.GetProfessorDetail,
		...searchCourseResolvers.CourseQuery.GetCourse,
		...searchCourseResolvers.CourseQuery.GetCourseDetail,
	},
	Mutation: {
		...usersResolvers.Mutation
	}
}