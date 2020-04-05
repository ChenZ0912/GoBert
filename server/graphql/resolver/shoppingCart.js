
const User = require('../../models/User');
const Course = require('../../models/Course');
const Section = require('../../models/Section');
const Semester = require('../../models/Semester');
const checkAuth = require('../../utils/checkAuth');

const product = require('cartesian-product');
const dateConverter = require('date-and-time');
const pattern = dateConverter.compile('h:m A');

async function fromShoppingCartGetCourseInfo(courses) {
    const allSemesters = await Semester.find({});
    var result = {
        'semesters': []
    };

    for (let i = 0; i < allSemesters.length; i++) {
        result['semesters'].push(allSemesters[i].term);
    }
    for (let i = 0; i < courses.length; i++) {
        const currCourse = await Course.findOne({
            courseID: courses[i].courseID,
            courseTitle: courses[i].courseTitle
        });
        courses[i]['numRate'] = currCourse.numRate;
        courses[i]['score'] = currCourse.score;
    }

    result['courses'] = courses;
    return result;
}

function removeSectionFromSchedule(section, schedule){
    for (let i = 0; i < schedule.length; i++) {
        const element = schedule[i];
        if (element.courseID === section.courseID && element.courseTitle === section.courseTitle) {
            schedule.splice(i, 1);
            break;
        }
    }
    return schedule;
}

function convertDaystimes(schedules){
    for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < schedules[i].length; j++) {

            const dt = schedules[i][j].daystimes;
            var newDT = {
                "TBA": false,
                "daysOfWeek": [],
                "start": "",
                "end": ""
            };
            if (dt === "TBA") {
                newDT['TBA'] = true;
            }else{
                if (dt.includes('Su')) {
                    newDT['daysOfWeek'].push(0);
                }
                if (dt.includes('Mo')) {
                    newDT['daysOfWeek'].push(1);
                }
                if (dt.includes('Tu')) {
                    newDT['daysOfWeek'].push(2);
                }
                if (dt.includes('We')) {
                    newDT['daysOfWeek'].push(3);
                }
                if (dt.includes('Tu')) {
                    newDT['daysOfWeek'].push(4);
                }
                if (dt.includes('Fr')) {
                    newDT['daysOfWeek'].push(5);
                }
                if (dt.includes('Sa')) {
                    newDT['daysOfWeek'].push(6);
                }
                // timing = "10:30am - 1:30pm"
                const timing = dt.split(/ (.+)/)[1];
                // convert 12 hour to 24 hour manner
                var toBeUpdated = timing.split(' - ');
                var start = toBeUpdated[0];
                var end = toBeUpdated[1];

                function convertTo24(t){
                    if (t.includes('am')){
                        t = t.replace(/am/g, ":00");
                    }
                    if (t.includes('pm')){
                        var temp = t.split(':');
                        if (temp[0] !== '12'){
                            t = (parseInt(temp[0]) + 12).toString() + ":" + temp[1];
                        }
                        t = t.replace(/pm/g, ":00");
                    }
                    return t;
                }

                newDT['start'] = convertTo24(start);
                newDT['end'] = convertTo24(end);
            }


            const elem = schedules[i][j];
            var obj = {
                'courseID': elem.courseID,
                'courseTitle': elem.courseTitle,
                'daystimes': newDT,
                'professor': elem.professor,
                'classNo': elem.classNo,
                'term': elem.term,
                '_id': elem.course_id,
                'dates': elem.dates
            }
            schedules[i][j] = obj;
        }
    }

    return schedules;
}

function cleanSchedule(allSchedules){

    var possibleSchedules = [];
    
    while(allSchedules.length !== 0){
        var oneSchedule = allSchedules.pop();
        // parse all sections in a schedule into weekdays: Su Mo Tu We Th Fr Sa
        var sectionByDays = [ [], [], [], [], [], [], [] ];

        for (let j = 0; j < oneSchedule.length; j++) {
            const oneSection = oneSchedule[j];
            const t = oneSection.daystimes.split(/ (.+)/);
            const days = t[0];
            if (days.includes('Su')) {
                sectionByDays[0].push(oneSection);
            }
            if (days.includes('Mo')) {
                sectionByDays[1].push(oneSection);
            }
            if (days.includes('Tu')) {
                sectionByDays[2].push(oneSection);
            }
            if (days.includes('We')) {
                sectionByDays[3].push(oneSection);
            }
            if (days.includes('Tu')) {
                sectionByDays[4].push(oneSection);
            }
            if (days.includes('Fr')) {
                sectionByDays[5].push(oneSection);
            }
            if (days.includes('Sa')) {
                sectionByDays[6].push(oneSection);
            }
        }

        var conflictFlag = false;
        for (let j = 0; j < sectionByDays.length; j++) {
            const oneDay = sectionByDays[j];
            for (let k = 0; k < oneDay.length; k++) {
                const oneSection = oneDay[k];
                const oneTime = oneSection.daystimes;
                for (let m = k + 1; m < oneDay.length; m++) {
                    const secSection = oneDay[m];
                    const secTime = secSection.daystimes;
                    const time1 = oneTime.split(/ (.+)/)[1];
                    const time2 = secTime.split(/ (.+)/)[1];
                    conflictFlag = timeOverlap(time1, time2);
                    if (conflictFlag){
                        if (oneSection.priority === 'required' && secSection.priority === 'required') {
                            break;
                        }
                        conflictFlag = false;
                        if (oneSection.priority === 'required') {
                            // get rid of the second section
                            oneSchedule = removeSectionFromSchedule(secSection, oneSchedule);
                            break;
                        }
                        if (secSection.priority === 'required'){
                            // get rid of the first section
                           oneSchedule = removeSectionFromSchedule(oneSection, oneSchedule);
                           break;
                        }
                        // fancy part comes: we need to generate a different schedule for the following
                        if (oneSection.priority === 'interested' && secSection.priority === 'interested') {
                            allSchedules.push(removeSectionFromSchedule(oneSection, oneSchedule));
                            allSchedules.push(removeSectionFromSchedule(secSection, oneSchedule));
                            // reset conflictFlag to true, so that this schedule will not be generated
                            conflictFlag = true;
                        }
                        if (oneSection.priority === 'interested'){
                            // get rid of the second section
                            oneSchedule = removeSectionFromSchedule(secSection, oneSchedule);
                            break;
                        }

                        if (secSection.priority === 'interested'){
                            // get rid of the first section
                            oneSchedule = removeSectionFromSchedule(oneSection, oneSchedule);
                            break;
                        }

                        // same fancy part
                        if (oneSection.priority === 'giveupable' && secSection.priority === 'giveupable') {
                            allSchedules.push(removeSectionFromSchedule(oneSection, oneSchedule));
                            allSchedules.push(removeSectionFromSchedule(secSection, oneSchedule));
                            // reset conflictFlag to true, so that this schedule will not be generated
                            conflictFlag = true;
                        }
                        if (oneSection.priority === 'giveupable') {
                            // get rid of the second section
                            oneSchedule = removeSectionFromSchedule(secSection, oneSchedule);
                            break;
                        }

                        if (secSection.priority === 'giveupable') {
                            // get rid of the first section
                            oneSchedule = removeSectionFromSchedule(oneSection, oneSchedule);
                            break;
                        }
                    }
                }
                if (conflictFlag) { break; }
            }
            if (conflictFlag) { break; }
        }

        if (!conflictFlag) {
            possibleSchedules.push(oneSchedule);
        }

    }


    return convertDaystimes(possibleSchedules);
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

                    return await fromShoppingCartGetCourseInfo(user.shoppingCart);

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
                const user = await User.findOne({
                    username: tempUser.username
                });
                // Assume all courses are required
                // TODO add priority
                // get all the sections
                var cart = user.shoppingCart;
                var allSections = [];
                var priority = {};
                var result = {};
                var course_id = {};
                for (let i = 0; i < cart.length; i++) {
                    priority[cart[i].courseID + cart[i].courseTitle] = cart[i].priority;
                    course_id[cart[i].courseID + cart[i].courseTitle] = 
                        (await Course.findOne({
                            courseID: cart[i].courseID,
                            courseTitle: cart[i].courseTitle
                        }))._id;
                    
                    // no open section
                    const sections1 = await Section.find({
                        courseID: cart[i].courseID,
                        courseTitle: cart[i].courseTitle,
                        status: "Open",
                        term: term
                    });
                    const sections2 = await Section.find({
                        courseID: cart[i].courseID,
                        courseTitle: cart[i].courseTitle,
                        term: term
                    });
                    if (sections1.length === 0){
                        cart[i]['reason'] = "No open section in " + term;
                        if (result['noSection']){
                            result['noSection'].push(cart[i]);
                        } else {
                            result['noSection'] = [cart[i]];
                        }
                        continue;
                    }
                    if (sections2.length === 0) {
                        cart[i]['reason'] = "Course not offer in " + term;
                        if (result['noSection']) {
                            result['noSection'].push(cart[i]);
                        } else {
                            result['noSection'] = [cart[i]];
                        }
                        continue;
                    }

                    // there are some sections that only the classNo is different.
                    // remove those given we need scheduling. This also solves the TBA duplicates.
                    var sectionWithPriorty = Array.from(new Set(sections1.map(a => (a.professor + a.daystimes))))
                    .map(id => {
                        return sections1.find(a => (a.professor + a.daystimes) === id)
                    })

                    for (let i = 0; i < sectionWithPriorty.length; i++) {
                        const element = sectionWithPriorty[i];
                        sectionWithPriorty[i]['priority'] = priority[element.courseID + element.courseTitle];
                        sectionWithPriorty[i]['course_id'] = course_id[element.courseID + element.courseTitle];
                    }
                    allSections.push(sectionWithPriorty);
                }
                // cartesian products to find all potential schedule
                const possibleSchedules = cleanSchedule(product(allSections));
                result['schedule'] = possibleSchedules;
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
                        return (await fromShoppingCartGetCourseInfo(newShoppingCart))['courses'];
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
                            return (await fromShoppingCartGetCourseInfo([element]))['courses'][0];
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
                        return (await fromShoppingCartGetCourseInfo([element]))['courses'][0];
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