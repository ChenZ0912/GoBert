const searchProfessorResolvers = require('./searchProfessor');
const searchCourseResolvers = require('./searchCourse');
const searchResolvers = require('./search');
const usersResolvers = require('./users');

module.exports = {
	Query: {
		...searchProfessorResolvers.ProfQuery.GetProfessorByName,
		...searchProfessorResolvers.ProfQuery.GetProfessorDetail,
		...searchCourseResolvers.CourseQuery.GetCourse,
		...searchCourseResolvers.CourseQuery.GetCourseDetail,
		...searchResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation
	}
}