const {
  AuthenticationError
} = require('apollo-server');

const Rate = require('../../models/Rate');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query: {
      async getRatings(_,
      {
        searchCourseInput: {
          cID,
          cTitle,
          professor
        }
      }, 
      context,
      info){
        try {
          var rateSummaries = await Rate.find({
            courseID: cID,
            courseTitle: cTitle,
            professor: professor
          }).sort({ createdAt: -1 });
          return rateSummaries;
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    Mutation: {
      async postRate(_, { 
        rateInput: {
          courseID, courseTitle, courseScore, professor,
          professorScore, term, anonymity, comment
        }
      },
      context,
      info){
        const user = checkAuth(context);
        // check if that user already rate the course
        const oldRate = await Rate.findOne({
          username: user.username,
          courseID,
          courseTitle,
          professor
        });
        if (oldRate){
          throw Error("User already rated this course");
        }
        const newRate = new Rate({
          username: user.username,
          courseTitle, courseID, courseScore,
          term, anonymity, professor,
          professorScore, comment,
          upvotes: [], downvotes: [],
          createdAt: new Date().toISOString()
        });

        const rate = await newRate.save();

        return rate;
      },

      async deleteRate(_, { rateId }, context){
        const user = checkAuth(context);
        try{
          const rate = await Rate.findById(rateId);
          if (user.username === rate.username){
            await rate.delete();
            return 'Post Delete Successfully';
          }else{
            throw new AuthenticationError('Action not allowed');
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    }
}