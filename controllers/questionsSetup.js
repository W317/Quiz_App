import { question } from "../model/questions.js"

const randomInt = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const genArrNumber = (max, size) => {
    const ranArr = []
    if (!size || size === 0) {
        return
    }

    do {
        const randomNumber = randomInt(0, max)

        if (!ranArr.includes(randomNumber)) { ranArr.push(randomNumber) }
    } while (ranArr.length < size)

    return ranArr

}

export const getRandomQuestions = (max, size, arr) => {
    const randomArr = []
    for (const ele of genArrNumber(max, size)) {
        randomArr.push(arr[ele])
    }

    return randomArr
}

export const getCorrectAnswer = async (listQuestion) => {
    const arr = {}
    for (const listQuestionItem of listQuestion) {
        arr[listQuestionItem._id] = listQuestionItem.correctAnswer;
    }
    return arr;
}

export const checkUserAnswer = async (usersAnswers, correctAnswers) => {
    let res = 0;
    for (const keyId in usersAnswers) {
        if (usersAnswers[keyId] == correctAnswers[keyId]) {
            res++
        }
    } 
    
    return res;
}

export const scoreText = async (score) => {
    try {
      const totalQuestion = await question.countDocuments().exec();
      const scorePercentage = (score / totalQuestion) * 10;
      console.log(totalQuestion, scorePercentage);
  
      if (scorePercentage < 5) return "Practice more to improve it :D";
      if (scorePercentage >= 5 && scorePercentage < 7) return "Good, keep up!";
      if (scorePercentage >= 7 && scorePercentage < 9) return "Well done!";
      if (scorePercentage >= 9 && scorePercentage <= 10) return "Perfect";
      else return "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };
  