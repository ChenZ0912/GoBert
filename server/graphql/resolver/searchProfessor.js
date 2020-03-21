const Professor = require('../../models/Professor');
const RateSummary = require('../../models/RateSummary');
const Rate = require('../../models/Rate');
const escapeRegex = require("../../utils/escape");
const Teach = require('../../models/Teach');

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
                
                if (!rating){
                    rating = {
                        'courseID': courseID,
                        'courseTitle': courseTitle,
                        'avgProfScore': 0.0,
                        'avgCourseScore': 0.0,
                        'numRate': 0,
                        'professor': professor,
                        'ratings': []
                    }
                }else{
                  rating['ratings'] = ratings;
                }
                profStats.push(rating);
            }

          professor['rateSummary'] = profStats;
          return professor;
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
}