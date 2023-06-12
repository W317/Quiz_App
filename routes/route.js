import express from 'express'
import { createAttempt, updateAttempt } from '../controllers/attemptsSetup.js';
import { addQuiz } from '../controllers/questionController.js';

export const router = express.Router();

router.route('/').post(createAttempt)
router.route('/:id/submit').post(updateAttempt) 
router.route('/create').post(addQuiz)
