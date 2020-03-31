const Course = require('../../models/Course');
const Professor = require('../../models/Professor');
const Rate = require('../../models/Rate');
const RateSummary = require('../../models/RateSummary');
const Section = require('../../models/Section');

module.exports = {
    Mutation: {
        async clearAll(_, {
            password
        }){ 
            // await Section.updateMany({}, {
            //   $rename: {
            //     "daystimes": "dt"
            //   }
            // });
            // return "halo";
            if (password !== 'Kaixuan'){
                throw new Error('incorrect password');
            }
            const rates = await Rate.find({});
            const courses = [];
            const professors = [];
            const rateSummaries = [];
            
            for (let i = 0; i < rates.length; i++) {
                const rate = rates[i];
                const ci = courses.findIndex(element => element.courseID === rate.courseID && element.courseTitle === rate.courseTitle);
                const pi = professors.findIndex(element => element.name === rate.professor);
                const ri = rateSummaries.findIndex(element => element.courseID === rate.courseID && element.courseTitle === rate.courseTitle && element.professor === rate.professor);
                // course not exist
                if (ci === -1){
                    courses.push({
                        'courseID': rate.courseID,
                        'courseTitle': rate.courseTitle,
                        'score': rate.courseScore,
                        'numRate': 1
                    });
                }else{
                    const score = courses[ci]['score'];
                    const numRate = courses[ci]['numRate'];
                    courses[ci]['score'] = (score * numRate + rate.courseScore) / (numRate + 1.0);
                    courses[ci]['numRate'] += 1;
                }
                // professor not exist
                if (pi === -1){
                    professors.push({
                        'name': rate.professor,
                        'numRate': 1,
                        'score': rate.professorScore
                    })
                } else {
                    const score = professors[pi]['score'];
                    const numRate = professors[pi]['numRate'];
                    professors[pi]['score'] = (score * numRate + rate.professorScore) / (numRate + 1.0);
                    professors[pi]['numRate'] += 1;
                }
                // rateSummary not exist
                if (ri === -1) {
                    rateSummaries.push({
                        'professor': rate.professor,
                        'courseID': rate.courseID,
                        'courseTitle': rate.courseTitle,
                        'avgCourseScore': rate.courseScore,
                        'avgProfScore': rate.professorScore,
                        'numRate': 1
                    })
                } else {
                    const avgCourseScore = rateSummaries[ri]['avgCourseScore'];
                    const avgProfScore = rateSummaries[ri]['avgProfScore'];
                    const numRate = rateSummaries[ri]['numRate'];
                    rateSummaries[ri]['avgCourseScore'] = (avgCourseScore * numRate + rate.courseScore) / (numRate + 1.0);
                    rateSummaries[ri]['avgProfScore'] = (avgProfScore * numRate + rate.professorScore) / (numRate + 1.0);
                    rateSummaries[ri]['numRate'] += 1;
                }
            }

            // clear db course;
            await Course.updateMany({}, {
                $set: {
                    numRate: 0,
                    score: 0
                }
            });
            // clear db professor;
            await Professor.updateMany({}, {
                $set: {
                  numRate: 0,
                  score: 0
                }
            });
            // clear db rateSummary;
            await RateSummary.updateMany({}, {
                $set: {
                    numRate: 0,
                    avgCourseScore: 0.0,
                    avgProfScore: 0.0
                }
            });

            // update db course;
            for (let i = 0; i < courses.length; i++) {
                const element = courses[i];
                await Course.updateOne({
                    courseID: element.courseID,
                    courseTitle: element.courseTitle
                }, {
                    $set: element
                });
            }

            // update professor;
            for (let i = 0; i < professors.length; i++) {
                const element = professors[i];
                await Professor.updateOne({
                    name: element.name
                }, {
                    $set: element
                });
            }
            
            // update rateSummary;
            for (let i = 0; i < rateSummaries.length; i++) {
                const element = rateSummaries[i];
                await Professor.updateOne({
                    courseID: element.courseID,
                    courseTitle: element.courseTitle,
                    name: element.professor
                }, {
                    $set: element
                });
            }

            return "finish update db";
        }
    }
}