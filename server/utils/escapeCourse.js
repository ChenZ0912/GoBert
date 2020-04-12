module.exports = function escapeCourse(query) {
    var total = query.replace(/[^a-zA-Z0-9 ]+/g, "");
    total = total.replace(/\s\s+/g, ' ');
    // console.log(total);
    return total;
};
