
const User = require('../../models/User');
const Course = require('../../models/Course');
const checkAuth = require('../../utils/checkAuth');

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