const Professor = require('../../models/Professor');
const RateSummary = require('../../models/RateSummary');
const Rate = require('../../models/Rate');
const escapeRegex = require("../../utils/escape");
const Teach = require('../../models/Teach');
const Course = require('../../models/Course');

module.exports = {
  ProfQuery: {
    GetProfessorByName: {
      // at first, the frontend will trigger this function
      // dependent on the number of replies, the frontend should have logic to instruct the users
      // if the length of response is 1, then call the below function directly
      // else: ask the client which one is he looking for by listing all the names
      async getProfessorByName(_, {
        query
      }, context) {
        try {
          const fuzzyProf = new RegExp(escapeRegex(query), 'gi');
          const professors = await Professor.find({
            name: fuzzyProf
          });
          return professors;
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    GetProfessorDetail: {
      // if empty, means no result
      async getProfessorDetail(_, {
        query
      }, context) {
        try {
            
            var professor = await Professor.findOne({
                name: query
            });

            if (!professor){
              throw new Error("Cannot find professor " + query);
            }
            var teaches = await Teach.find({
                professor: query
            })
            var profStats = [];
            for (let i = 0; i < teaches.length; i++) {
                const courseID = teaches[i]['courseID'];
                const courseTitle = teaches[i]['courseTitle'];
                const professor = teaches[i]['professor'];
                var rating = await RateSummary.findOne({
                    courseID: courseID,
                    courseTitle: courseTitle,
                    professor: professor
                });
                var ratings = await Rate.find({
                    courseID: courseID,
                    courseTitle: courseTitle,
                    professor: professor
                });
                var course = await Course.findOne({
                  courseID: courseID,
                  courseTitle: courseTitle
                });



                if (!rating){
                    rating = {
                        'courseID': courseID,
                        'courseTitle': courseTitle,
                        'avgProfScore': 0.0,
                        'avgCourseScore': 0.0,
                        'numRate': 0,
                        'professor': professor,
                        'ratings': [],
                        'course_id': course._id
                    }
                }else{
                  rating['ratings'] = ratings;
                  rating['avgProfScore'] = Math.round((rating['avgProfScore'] + Number.EPSILON) * 100) / 100;
                  rating['avgCourseScore'] = Math.round((rating['avgCourseScore'] + Number.EPSILON) * 100) / 100;
                  rating['course_id'] = course._id;
                }
                profStats.push(rating);
            }
          
          professor['score'] = Math.round((professor['score'] + Number.EPSILON) * 100) / 100
          professor['rateSummary'] = profStats;
          return professor;
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
}