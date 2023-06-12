import mongoose from "mongoose";
import { createQuestions } from "./questions.js";

const createAttempts = new mongoose.Schema({
    questions: [createQuestions],
    completed: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    correctAnswers: Object,
    startedAt: {
        type: Date,
        required: true
    },
    userAnswers: Object,
    scoreText: {
        type: String,
        required: false
    }
})

export const attempt = mongoose.model("attempt", createAttempts)