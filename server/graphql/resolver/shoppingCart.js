
const User = require('../../models/User');
const Course = require('../../models/Course');
const checkAuth = require('../../utils/checkAuth');


module.exports = {
  Query: {
    async getShoppingCart(_, {
        username
    },
    context) {
        const tempUser = checkAuth(context);
        const user = await User.findOne({
            username: tempUser.username
        });
        var courses = [];
        for (let index = 0; index < user.shoppingCart.length; index++) {
            const course = await Course.findOne({
                _id: user.shoppingCart[index]
            })
            courses.push(course);
        }
        return courses;
    }
  }
}