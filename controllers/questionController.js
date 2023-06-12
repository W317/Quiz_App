import asyncHandler from 'express-async-handler';
import {question} from '../model/questions.js'; 

export const addQuiz = asyncHandler(async (req, res) => {
  try {
    const questionTitle = req.body.question;
    const arrAnswer = req.body.answers;
    const correctAnswer = req.body.correctAnswer;
    console.log(req.body);

    const answersArray = arrAnswer.split("/ ");

    const newQuiz = new question({
      answers: answersArray,
      text: questionTitle,
      correctAnswer: correctAnswer-1
    });

    const addedQuiz = await newQuiz.save();

    res.status(201).json(addedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
