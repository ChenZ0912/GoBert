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
