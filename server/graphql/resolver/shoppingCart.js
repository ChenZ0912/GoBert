
const User = require('../../models/User');
const Course = require('../../models/Course');
const Section = require('../../models/Section');
const checkAuth = require('../../utils/checkAuth');

const product = require('cartesian-product');
const dateConverter = require('date-and-time');
const pattern = dateConverter.compile('h:m A');

async function fromShoppingCartGetCourseInfo(courses) {
    for (let i = 0; i < courses.length; i++) {
        const currCourse = await Course.findOne({
            courseID: courses[i].courseID,
            courseTitle: courses[i].courseTitle
        });
        courses[i]['numRate'] = currCourse.numRate;
        courses[i]['score'] = currCourse.score;
    }
    return courses;
}

// format "10:40am - 12:30pm", "12:20pm - 13:50pm"
// return true
function timeOverlap(time1, time2) {
    var tl = time1.replace(/am/g, " AM");
    tl = tl.replace(/pm/g, " PM");
    var tr = time2.replace(/am/g, " AM");
    tr = tr.replace(/pm/g, " PM");

    const t1 = tl.split(" - ");
    const t2 = tr.split(" - ");

    const t1start = dateConverter.parse(t1[0], pattern);
    const t1end = dateConverter.parse(t1[1], pattern);
    const t2start = dateConverter.parse(t2[0], pattern);
    const t2end = dateConverter.parse(t2[1], pattern);

    return (t1start <= t2start && t2start <= t1end) || (t2start <= t1start && t1start <= t2end);
}

module.exports = {
    Query: {
        async getShoppingCart(_, {
            username
        },
        context) {
            const tempUser = checkAuth(context);
            if (username === tempUser.username){
                try {
                    const user = await User.findOne({
                        username: tempUser.username
                    });
                    return fromShoppingCartGetCourseInfo(user.shoppingCart);

                } catch (err){
                    throw new Error(err);
                }

            }else {
                throw new Error("User not match");
            }
        },

        async generateSchedule(_, {
            username, term
        },
        context){

            const tempUser = checkAuth(context);
            if (username === tempUser.username) {
              try {
                
                var result = {};
                const user = await User.findOne({
                  username: tempUser.username
                });
                // Assume all courses are required
                // TODO add priority
                // get all the sections
                const cart = user.shoppingCart;
                var schedules = [];
                for (let i = 0; i < cart.length; i++) {
                    const sections = await Section.find({
                        courseID: cart[i].courseID,
                        courseTitle: cart[i].courseTitle,
                        status: "Open",
                        term: term
                    });

                    if (sections.length !== 0){
                        schedules.push(sections);
                    } else {
                        if (result.noSection){
                            result.noSection.push(cart[i]);
                        } else {
                            // either no open section, or wrong semester
                            result['noSection'] = [cart[i]];
                        }
                    }
                }
                
                // cartesian products to find all potential schedules
                const allSchedules = product(schedules);
                
                
                for (let i = 0; i < allSchedules.length; i++) {
                    const oneSchedule = allSchedules[i];
                    // parse all section into weekdays: Mo Tu We Th Fr Sa Su
                    var sectionByDays = [[], [], [], [], [], [], []];
                    for (let j = 0; j < oneSchedule.length; j++) {
                        const oneSection = oneSchedule[j];
                        const t = oneSection.daystimes.split(/ (.+)/);
                        const days = t[0];
                        if (days.includes('Mo')) {
                            sectionByDays[0].push(oneSection);
                        }
                        if (days.includes('Tu')) {
                            sectionByDays[1].push(oneSection);
                        }
                        if (days.includes('We')) {
                            sectionByDays[2].push(oneSection);
                        }
                        if (days.includes('Th')) {
                            sectionByDays[3].push(oneSection);
                        }
                        if (days.includes('Fr')) {
                            sectionByDays[4].push(oneSection);
                        }
                        if (days.includes('Sa')) {
                            sectionByDays[5].push(oneSection);
                        }
                        if (days.includes('Su')) {
                            sectionByDays[6].push(oneSection);
                        }
                    }
                }

                // check if daystimes conflict within one schedule
                var conflictFlag = false;
                var possibleSchedules = [];
                for (let i = 0; i < allSchedules.length; i++) {
                    const oneSchedule = allSchedules[i];
                    for (let j = 0; j < sectionByDays.length; j++) {
                        const oneDay = sectionByDays[j];

                        for (let k = 0; k < oneDay.length; k++) {
                        const oneTime = oneDay[k].daystimes;
                        for (let m = k + 1; m < oneDay.length; m++) {
                            const secTime = oneDay[m].daystimes;
                            const time1 = oneTime.split(/ (.+)/)[1];
                            const time2 = secTime.split(/ (.+)/)[1];
                            conflictFlag = timeOverlap(time1, time2);
                            if (conflictFlag) {
                                break;
                            }
                        }
                        }
                        if (conflictFlag) {
                            break;
                        }
                    }
                    if (!conflictFlag) {
                        possibleSchedules.push(oneSchedule);
                    }
                }
                
                result['schedule'] = possibleSchedules;
                console.log(result);
                return result;
              } catch (err) {
                throw new Error(err);
              }

            } else {
              throw new Error("User not match");
            }
        }
    },
    Mutation: {
        async addToShoppingCart(_, {
            username,
            courseID,
            courseTitle,
            priority
        }, context) {
            const tempUser = checkAuth(context);
            if (tempUser.username === username) {
                try{
                    const user = await User.findOne({
                        username: tempUser.username
                    });
                    var newShoppingCart = user.shoppingCart;
                    for (let index = 0; index < newShoppingCart.length; index++) {
                        const element = newShoppingCart[index];
                        if(courseID === element.courseID && courseTitle === element.courseTitle){
                            throw new Error( courseID + ' ' + courseTitle + ' is already in shopping cart');
                        }
                    }
                    
                    const courseExist = await Course.findOne({
                        courseID: courseID,
                        courseTitle: courseTitle
                    });

                    if (courseExist){
                        newShoppingCart.push({
                            'courseID': courseID,
                            'courseTitle': courseTitle,
                            'priority': priority
                        });
                        await User.updateOne({
                            username: tempUser.username
                        }, {
                        $set: {
                            shoppingCart: newShoppingCart
                        }
                        });
                        return await fromShoppingCartGetCourseInfo(newShoppingCart);
                    } else {
                        throw new Error(courseID + ' ' + courseTitle + ' does not exist')
                    }

                } catch (err){
                    throw new Error(err);
                }

            } else {
                throw new Error("User not match");
            }
        },
        async removeFromShoppingCart(_, {
            username,
            courseID,
            courseTitle
        }, context){
            const tempUser = checkAuth(context);
            if (tempUser.username === username) {

                try {
                    const user = await User.findOne({
                        username: tempUser.username
                    });
                    var newShoppingCart = user.shoppingCart;
                    for (let index = 0; index < newShoppingCart.length; index++) {
                        const element = newShoppingCart[index]
                        if (element.courseID == courseID && courseTitle) {
                            newShoppingCart.splice(index, 1);
                            await User.updateOne({
                                username: tempUser.username
                            }, {
                                $set: {
                                    shoppingCart: newShoppingCart
                                }
                            });
                            return (await fromShoppingCartGetCourseInfo([element]))[0];
                        }
                    }
                    throw new Error("Cannot find " + courseID + " " + courseTitle + " in user shopping cart");
                } catch (err) {
                    throw new Error(err);
                }

            } else {
              throw new Error("User not match");
            }
        },

        async changeCoursePriority(_, {
            username,
            courseID,
            courseTitle,
            priority
        }, context){
            const tempUser = checkAuth(context);
            if (tempUser.username === username) {
              try {
                const user = await User.findOne({
                  username: tempUser.username
                });
                var newShoppingCart = user.shoppingCart;
                for (let index = 0; index < newShoppingCart.length; index++) {
                    const element = newShoppingCart[index];
                    if (element.courseID === courseID && element.courseTitle === courseTitle){
                        newShoppingCart[index].priority = priority;
                        await User.updateOne({
                            username: tempUser.username
                        }, {
                            $set: {
                                shoppingCart: newShoppingCart
                            }
                        });
                        return (await fromShoppingCartGetCourseInfo([element]))[0];
                    }
                }

                throw new Error("Cannot find " + courseID + " " + courseTitle + " in user shopping cart");
              } catch (err) {
                throw new Error(err);
              }

            } else {
              throw new Error("User not match");
            }
        }
    }
}