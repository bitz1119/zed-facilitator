const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  Quiz : [
    {
      question: String,
      option1 : String,
      option2 : String,
      option3 : String,
      option4 : String,
      Correctoption : String
    }
  ]
  
})
module.exports = mongoose.model('Question', QuestionSchema);