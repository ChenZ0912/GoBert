const {
  model,
  Schema
} = require('mongoose');

const semesterSchema = new Schema({
    term: String
})

module.exports = model('semesters', semesterSchema);