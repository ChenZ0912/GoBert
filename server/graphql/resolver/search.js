const Professor = require('../../models/Professor');
const escapeRegex = require("../../utils/escape");
const Course = require('../../models/Course');

module.exports = {
  Query: {
      async getSearchResult(_, {
          query
      }, 
      context,
      info){
        try {
            const fuzzyQuery = new RegExp(escapeRegex(query), 'gi');
            var professors = await Professor.find({
                name: fuzzyQuery
            });
            for (let i = 0; i < professors.length; i++) {
                professors[i]['category'] = 'Professor';
            }
            var courses = await Course.find({
                $or: [{
                courseID: fuzzyQuery
                }, {
                courseTitle: fuzzyQuery
                }]
            })
            for (let i = 0; i < courses.length; i++) {
                courses[i]['category'] = 'Course';
                courses[i]['name'] = courses[i]['courseID'] + ': ' + courses[i]['courseTitle'];
                delete courses[i].courseID;
                delete courses[i].courseTitle;
            }

            return professors.concat(courses);

        } catch (err) {
            throw new Error(err);
        }
      }
  }
}