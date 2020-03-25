
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
            if (username === tempUser.username){
                const user = await User.findOne({
                    username: tempUser.username
                });
                return user.shoppingCart;
            }else {
                throw new Error("User not match");
            }
        }
    },
    Mutation: {
        async addToShoppingCart(_, {
            username,
            courseID,
            courseTitle
        }, context) {
            const tempUser = checkAuth(context);
            if (tempUser.username === username) {
                const user = await User.findOne({
                    username: tempUser.username
                });
                var newShoppingCart = user.shoppingCart;
                newShoppingCart.push({
                    'courseID': courseID,
                    'courseTitle': courseTitle
                });
                await User.updateOne({
                    username: tempUser.username
                }, {
                    $set: {
                        shoppingCart: newShoppingCart
                    }
                });
                for (let index = 0; index < newShoppingCart.length; index++) {
                    const element = newShoppingCart[index];
                }
                return newShoppingCart;
            } else {
                throw new Error("User not match");
            }
        }
    }

    

    // async removeFromShoppingCart(){},

    // async changeCoursePriority(){}
}