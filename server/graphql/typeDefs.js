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
		ratings: [RateSummary]
	}
	type Course{
		courseID: String
		courseTitle: String
		score: Float
		numRate: Int
		ratings: [RateSummary]
	}
	type Section{
		courseID: String,
		courseTitle: String,
		term: String,
		classNo: String,
		daysTimes: String,
		location: String,
		room: String,
		status: String,
		professor: String
	}

	input SearchCourseInput {
		cID: String!
		cTitle: String!
	}
	type Query{
		getProfessorByName(query: String!): [Professor],
		getProfessorDetail(query: String!): Professor,
		getCourse(query: String!): [Course],
		getCourseDetail(searchCourseInput: SearchCourseInput): Course,
	}
`