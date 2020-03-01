const {
  model,
  Schema
} = require('mongoose');

const sectionSchema = new Schema({
  courseID: String,
  courseTitle: String,
  professor: String
})

module.exports = model('teaches', sectionSchema);