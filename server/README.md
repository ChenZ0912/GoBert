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

  # When you do a postRate in localhost:4000, you need to add
  # http header: { "Authorization":"Bearer userToken" }, where userToken is the token retruned by register/login
  postRate(
      rateInput: {
      	courseID: "CSUY 2124"
        courseTitle: "Object Oriented Programming"
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

  deleteRate(rateId: "rateID")

  upvote(rateId: "5e7bcd74a4ce7c00ed5c4770"){
    alreadyRate
    username
    courseID
    courseTitle
    courseScore
    professor
    professorScore
    term
    anonymity
    comment
    upvotes
    downvotes
    createdAt
    id
  }
  
  downvote(rateId:"5e7bcd74a4ce7c00ed5c4770"){
    alreadyRate
    username
    courseID
    courseTitle
    courseScore
    professor
    professorScore
    term
    anonymity
    comment
    upvotes
    downvotes
    createdAt
    id
  }

  # Shopping Carts

  # addToShoppingCart -> [Course]
  addToShoppingCart(username:"cindy123", courseID: "CSUY 2124", courseTitle: "Object Oriented Programming LEC", priority: "required"){
    courseID
    courseTitle
    score
    numRate
    priority
  }

  # removeFromShoppingCart -> Course
  removeFromShoppingCart(username:"cindy123", courseID: "CSGY 6413", courseTitle: "Compiler Design and Construction LEC"){
    courseID
    courseTitle
    score
    numRate
    priority
  }

  # changeCoursePriority -> Course
  changeCoursePriority(username:"cindy123", courseID: "CSGY 6413", courseTitle: "Compiler Design and Construction LEC", priority: "required"){
    courseID
    courseTitle
    score
    numRate
    priority
  }
}
```
##### Query API
```
query {
  # This Query will return a combined result for course & professor
  getSearchResult(query: "2124"){
    category
    professor
    courseID
    courseTitle
    _id
    score
    numRate
  }

  # the id returned by getSearchResult
  getCourseDetail(id: "5e5af12f4cf31e4f4f440eaa"){
    courseID
    courseTitle
    score
    numRate
  	rateSummary{
      professor
      courseID
      courseTitle
      avgProfScore
      avgCourseScore
      numRate
      ratings{
        username
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
        _id
      }
    }
  }
  
  # Same format, but different param
  getProfessorDetail(query: "John Sterling"){
    name
    score
    numRate
  	rateSummary{
      professor
      courseID
      courseTitle
      avgProfScore
      avgCourseScore
      numRate
      ratings{
        username
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
        _id
      }
    }
  }

  # you need to provide a token in authorization
  getShoppingCart(username:"cindy123"){
    courseID
    courseTitle
    score
    numRate
    priority
  }

  generateSchedule(username: "cindy123", term: "Spring 2020"){
    noSection{
      courseID
      courseTitle
      priority
    }
    schedule{
      courseID
      courseTitle
      daystimes
      professor
    }
  }

}

```

##### Archived API
```
query{
  getRatings(
      searchCourseInput: {
        cID: "CSUY 2124"
        cTitle: "Object Oriented Programming"
        professor:"John Sterling"
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
    _id
  }

  getProfessorByName(query: "John") {
    name
    score
    numRate
  }

  getCourse(query: "object oriented") {
    courseID
    courseTitle
    score
    numRate
    _id
  }
}
```