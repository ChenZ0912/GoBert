const { gql } = require('apollo-server');

module.exports = gql`
	type RateSummary {
		professor: String
		courseID: String
		courseTitle: String
		avgProfScore: Float
		avgCourseScore: Float
		numRate: Int
	}
	type Professor {
		name: String
		score: Float
		numRate: Int
		ratings: [RateSummary]
	}
	type Course {
		courseID: String
		courseTitle: String
		score: Float
		numRate: Int
		ratings: [RateSummary]
	}
	type Section {
		courseID: String
		courseTitle: String
		term: String
		classNo: String
		daysTimes: String
		location: String
		room: String
		status: String
		professor: String
	}
	type User {
		email: String!
		username: String!
		token: String!
		standing: String
		major: String
		createdAt: String!
	}
	input SearchCourseInput {
		cID: String!
		cTitle: String!
		professor: String
	}
	input RateInput {
		username: String!
		courseID: String!
		courseTitle: String!
		courseScore: Float!
		professor: String!
		professorScore: Float!
		term: String!
		anonymity: Boolean!
		comment: String!
	}
	type RateOutput {
	  	username: String!
	    courseID: String!
	    courseTitle: String!
	    courseScore: Float!
	    professor: String!
	    professorScore: Float!
	    term: String!
	    anonymity: Boolean!
		comment: String!
		upvotes: [String]!
		downvotes: [String]!
	}
	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String
	}
	type Query{
		getProfessorByName(query: String!): [Professor]
		getProfessorDetail(query: String!): Professor
		getCourse(query: String!): [Course]
		getCourseDetail(searchCourseInput: SearchCourseInput): Course
		getRatings(searchCourseInput: SearchCourseInput): [RateSummary]
	}
	type Mutation{
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		postRating(rateInput: RateInput): RateOutput!
	}
`