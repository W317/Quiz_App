import { question } from "../model/questions.js"
import { attempt } from "../model/attempts.js"
import { checkUserAnswer, getCorrectAnswer, getRandomQuestions, scoreText } from "./questionsSetup.js"
import asyncHandler from "express-async-handler"

export const createAttempt = asyncHandler(async (req, res) => {
    const questions = await question.find({})
    const questionNumber = await question.countDocuments();
    const questionsRandomArr = getRandomQuestions(questionNumber-1, questionNumber, questions)
    const newAttempt = new attempt({
        questions: questionsRandomArr,
        score: 0,
        startedAt: new Date(),
        completed: false
    })

    const attempts = await newAttempt.save()

    if (newAttempt) {
        res.status(201)
        res.json(attempts)
    } else {
        res.status(404)
        throw new Error('Can not create attempt')
    }
})

export const updateAttempt = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const attempts = await attempt.findById(id);
    const questions = attempts.questions;
    const listCorrectAnswer = await getCorrectAnswer(questions);
    const userAnswers = req.body.userAnswers;
  
    const result = await checkUserAnswer(userAnswers, listCorrectAnswer);
    const scoreTextResult = await scoreText(result); // Await the scoreText function
  
    if (attempts) {
      attempts.score = result;
      attempts.userAnswers = userAnswers;
      attempts.correctAnswers = listCorrectAnswer;
      attempts.scoreText = scoreTextResult; // Assign the resolved value of scoreText
      attempts.completed = true;
  
      const updatedAttempt = await attempts.save();
      res.json(updatedAttempt);
    }
  });
  