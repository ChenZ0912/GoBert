const {
  model,
  Schema
} = require('mongoose');

const rmpSchema = new Schema({
    name: String,
    firstname: String,
    lastname: String,
    score: String,
    department: String,
    wouldTakeAgain: String,
    levelOfDifficulty: String,
    tags: [String],
    _id: Schema.Types.ObjectId
})

module.exports = model('rmp_records', rmpSchema);