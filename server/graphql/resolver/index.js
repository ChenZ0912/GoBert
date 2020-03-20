const searchProfessorResolvers = require('./searchProfessor');
const searchCourseResolvers = require('./searchCourse');
const searchResolvers = require('./search');
const usersResolvers = require('./users');
const rateResolvers = require('./rate');
const shoppingCartResolvers = require('./shoppingCart');

module.exports = {
	Query: {
		...searchProfessorResolvers.ProfQuery.GetProfessorByName,
		...searchProfessorResolvers.ProfQuery.GetProfessorDetail,
		...searchCourseResolvers.CourseQuery.GetCourse,
		...searchCourseResolvers.CourseQuery.GetCourseDetail,
		...searchResolvers.Query,
		...rateResolvers.Query,
		...shoppingCartResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...rateResolvers.Mutation
	}
}