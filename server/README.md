## GraphQL, MongoDB and Express
- add a config.js file of the format with the following content. This role has a read only access to the database. If you need write access, please contact me directly.
config.js
```
module.exports = {
	MONGODB: 'mongodb+srv://dbreader:dbreader@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority'
}
```
- npm i
- npm start

##### you can try the following code out in localhost:4000 playground, please see https://graphql.org/graphql-js/graphql-clients/ for client side code
##### Mutation API
```
mutation {

  register(registerInput:{
    username: "kai"
    password: "hashed"
    confirmPassword: "hashed"
    email: "kai@kai.com"
  }){
    token
    email
    standing
    major
    createdAt
    username
  }

  login(username: "kai", password: "hashed") {
    email
    username
    token
    standing
    major
    createdAt
  }

  // When you do a postRate in localhost:4000, you need to add
  // http header: { "Authorization":"Bearer userToken" }, where userToken is the token retruned by register/login
  postRate(
      rateInput: {
      	courseID: "CSUY 2124"
        courseTitle: "Object Oriented Programming  (Lecture)"
        courseScore: 4.5
        professor: "John Sterling"
        professorScore: 5.0
        term: "Spring 2020"
        anonymity: false
        comment: "The course is helpful and sterling is great"       
    }
  ){
    username
    anonymity
    courseID
    courseTitle
    term
    courseScore
    professor
    professorScore
    comment
    upvotes
    downvotes
    createdAt
  }

  deleteRate(rateId: "5e5af12f4cf31e4f4f441143")

}
```
##### Query API
```
query {
  // This Query will return a combined result for course & professor
  getSearchResult(query: "2124"){
    category
    name
    score
    numRate
  }
  getProfessorByName(query: "John") {
    name
    score
    numRate
  }
  getProfessorDetail(query: "John Sterling") {
    name
    score
    numRate
    ratings {
      courseID
      courseTitle
      avgProfScore
      avgCourseScore
      numRate
    }
  }
  getCourse(query: "object oriented") {
    courseID
    courseTitle
    score
    numRate
  }

  getCourseDetail(
    searchCourseInput: {
      cID: "CSUY 2124"
      cTitle: "Object Oriented Programming  (Lecture)"
    }
  ) {
    courseID
    courseTitle
    score
    numRate
    ratings {
      professor
      courseID
      courseTitle
      avgProfScore
      avgCourseScore
      numRate
    }
  }
}

```
