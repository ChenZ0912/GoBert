## GraphQL, MongoDB and Express
- add a config.js file of the format
config.js
```
module.exports = {
	MONGODB: 'mongodb url'
}
```
- npm i
- npm start

## Sample Endpoints
- searchProfessorFuzzy
- searchProfessorExact
- searchCourseFuzzy
- searchCourseExact
##### you can try the following code out in localhost:4000 playground, please see https://graphql.org/graphql-js/graphql-clients/ for client side code
```
query {
  searchProfessorFuzzy(query: "John"){
    name
    score
    numRate
  }
  searchProfessorExact(query: "John Sterling"){
    professor
    courseID
		courseTitle
    avgProfScore
    avgCourseScore
    numRate
  }
  searchCourseFuzzy(query: "object oriented"){
    courseID
    courseTitle
    score
    numRate
  }
  searchCourseFuzzy(query: "2124"){
    courseID
    courseTitle
    score
    numRate
  }
  searchCourseExact(searchCourseInput:{
    cID:"CSUY 2124",
    cTitle: "Object Oriented Programming  (Lecture)",
    prof: "John Sterling"
  }){
    professor
    courseID
    courseTitle
    avgProfScore
    avgCourseScore
    numRate
  }
}
```
