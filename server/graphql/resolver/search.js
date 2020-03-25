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

            function countOccurence(str1, array){
              str1 = str1.toLowerCase();
              var c = 0;
              for (var i = array.length - 1; i >= 0; i--) {
                if (str1.indexOf(array[i]) !== -1){
                  str1.replace(array[i]);
                  c += 1;
                }
              }
              return c;
            }

            function compare( a, b ) {
              var countA = 0;
              var countB = 0;
              countA += countOccurence(a.name, lookupWords);
              countB += countOccurence(b.name, lookupWords);
              if (countA > countB){
                return -1;
              }
              if (countB < countA){
                return 1;
              }
              return 0;
            }

            // for first time look up
            query = query.replace("-", "");
            const fuzzyQuery = new RegExp(escapeRegex(query), 'gi');
            // for second time look up and sorting
            var lookupWords = query.split(" ");
            for (var i = lookupWords.length - 1; i >= 0; i--) {
              lookupWords[i] = lookupWords[i].toLowerCase();
            }

            var i = lookupWords.length;
            while (i--) {
                if (lookupWords[i].length < 2) { 
                    lookupWords.splice(i, 1);
                } 
            }
            var lookupRegex = [];
            for (var i = lookupWords.length - 1; i >= 0; i--) {
              lookupRegex.push(new RegExp(escapeRegex(lookupWords[i]), 'gi'));
            }

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
            });

            

            if (professors.length === 0 && courses.length === 0){
              console.log('failed to search using the exact mode, transit to blurry mode');
              professors = await Professor.find({
                name: {
                  $in: lookupRegex
                }
              });

              // console.log(professors);
              for (let i = 0; i < professors.length; i++) {
                  professors[i]['category'] = 'Professor';
              }

              courses = await Course.find({
                  $or: [
                  {
                    courseID: {
                      $in: lookupRegex
                    }
                  }, 
                  {
                    courseTitle: {
                      $in: lookupRegex
                    }
                  }]
              });
            }

            for (let i = 0; i < courses.length; i++) {
                courses[i]['category'] = 'Course';
                courses[i]['name'] = courses[i]['courseID'] + ': ' + courses[i]['courseTitle'];
                delete courses[i].courseID;
                delete courses[i].courseTitle;
            }
            
            var result = professors.concat(courses);
            
            return result.sort(compare);;

        } catch (err) {
            throw new Error(err);
        }
      }
  }
}