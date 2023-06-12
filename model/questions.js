import mongoose from "mongoose"

export const createQuestions = new mongoose.Schema({
    answers: [{ 
        type: String, 
        required: true 
    }],
    text: { 
        type: String, 
        required: true 
    },
    correctAnswer: {
        type: Number,
        required: false,
    }
})

export const question = mongoose.model("question", createQuestions)