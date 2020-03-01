const { gql } = require('apollo-server');

module.exports = gql`
	type RateSummary{
		professor: String
		courseID: String
		courseTitle: String
		avgProfScore: Float
		avgCourseScore: Float
		numRate: Int
	}
	type Professor{
		name: String
		score: Float
		numRate: Int
	}
	type Course{
		courseID: String
		courseTitle: String
		score: Float
		numRate: Int
	}
	input SearchCourseInput{
		cID: String!
		cTitle: String!
		prof: String!
	}
	type Query{
		searchProfessorFuzzy(query: String!): [Professor],
		searchProfessorExact(query: String!): [RateSummary],
		searchCourseFuzzy(query: String!): [Course],
		searchCourseExact(searchCourseInput: SearchCourseInput): [RateSummary],
	}
`