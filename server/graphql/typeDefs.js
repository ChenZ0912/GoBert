const { gql } = require('apollo-server');

module.exports = gql`
	type searchResult {
		category: String
		professor: String
		courseID: String
		courseTitle: String
		score: Float
		numRate: Int
		name: String
		_id: String
	}

	type Rate {
		username: String
		anonymity: Boolean
		courseID: String
		courseTitle: String
		term: String
		courseScore: Float
		professor: String
		professorScore: Float
		comment: String
		upvotes: [String]
		downvotes: [String]
		createdAt: String
		_id: String
	}
	type RateSummary {
		professor: String
		courseID: String
		courseTitle: String
		avgProfScore: Float
		avgCourseScore: Float
		numRate: Int
		ratings: [Rate]
	}
	type Professor {
		name: String
		score: Float
		numRate: Int
		rateSummary: [RateSummary]
	}
	type Course {
		courseID: String
		courseTitle: String
		score: Float
		numRate: Int
		rateSummary: [RateSummary]
		priority: String
		_id: String
	}
	type Section {
		courseID: String
		courseTitle: String
		term: String
		classNo: String
		daystimes: String
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
		alreadyRate: Boolean
	  	username: String
	    courseID: String
	    courseTitle: String
	    courseScore: Float
	    professor: String
	    professorScore: Float
	    term: String
	    anonymity: Boolean
		comment: String
		upvotes: [String]
		downvotes: [String]
		createdAt: String
		id: String
	}

	type NoSection {
		courseID: String
		courseTitle: String
		priority: String
		reason: String
	}

	type Schedule {
		_id: String
		courseID: String
		courseTitle: String
		professor: String
		priority: String
		TBA: Boolean
		daysOfWeek: [Int]
		start: String
		end: String
		dates: String
		classNo: String
		term: String
	}

	type scheduleOutput {
		noSection: [NoSection]
		schedule: [[Schedule]]
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String
	}

	type ShoppingCart{
		semesters: [String]
		courses: [Course]
	}
	input shoppingCartItem {
		courseID: String
		courseTitle: String
	}
	type Query{
		getSearchResult(query: String!): [searchResult]
		getProfessorByName(query: String!): [Professor]
		getProfessorDetail(query: String!): Professor
		getCourse(query: String!): [Course]
		getCourseDetail(id: ID!): Course
		getOneRating(rateId: ID!): Rate
		getRatings(searchCourseInput: SearchCourseInput): [Rate]
		getShoppingCart(username: String!): ShoppingCart
		generateSchedule(username: String!, term: String!, intendedCourses: [String]): scheduleOutput
	}

	type Mutation{
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		postRate(rateInput: RateInput!): RateOutput
		deleteRate(rateId: ID!): RateSummary
		upvote(rateId: ID!): RateOutput
		downvote(rateId: ID!): RateOutput

		addToShoppingCart(username: String!, courseID: String!, courseTitle: String!, priority: String): [Course]
		removeFromShoppingCart(username: String!, courseID: String!, courseTitle: String!): Course
		changeCoursePriority(username: String!, courseID: String!, courseTitle: String!, priority: String!): Course
		clearAll(password: String): String
		getFirstLastName(password: String): String
		getFullCourseName(password: String): String
	}
`