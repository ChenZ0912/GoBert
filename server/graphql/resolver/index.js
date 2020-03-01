const searchResolvers = require('./search');

module.exports = {
	Query: {
		...searchResolvers.ProfQuery.QueryExact,
		...searchResolvers.ProfQuery.QueryFuzzy,
		...searchResolvers.CourseQuery.QueryFuzzy,
		...searchResolvers.CourseQuery.QueryExact,

	}
}