const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  answer: [String],
  correctAnswer: [String],
});

const quizResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    quizResult: {
      grade: {
        type: Number,
        required: true,
      },
      passed: {
        type: Boolean,
        required: true,
      },
      correctAnswers: [answerSchema],
      incorrectAnswers: [answerSchema],
    },
  },
  { timestamps: true }
);

const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);

module.exports = QuizResponse;
