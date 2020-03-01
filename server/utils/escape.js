module.exports = function escapeRegex(query) {
    return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
