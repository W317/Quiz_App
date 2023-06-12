const startBtn = document.querySelector("#btn-start")
const submitBtn = document.querySelector("#btn-submit")
const reviewBtn = document.querySelector("#btn-result")
const addBtn = document.querySelector(".btn-add")
const introduction = document.querySelector("#introduction")
const attempQuiz = document.querySelector("#attempt-quiz")
const reviewQuiz = document.querySelector("#review-quiz")
const addQuiz = document.querySelector('#add-quiz')
const addQuizBtn = document.querySelector('.add-quiz-btn')
const body = document.querySelector("body")
const hidden = document.querySelector(".hidden")
let resultShow = document.querySelector(".result-show")
let attemptId;
attempQuiz.classList.add("hidden")
reviewQuiz.classList.add("hidden")
addQuiz.classList.add("hidden")

function startClick() {
    attempQuiz.classList.remove("hidden")
    introduction.classList.add("hidden")
    body.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    fetch("http://localhost:3000/attempts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(json => {
            renderQuestion(json)
            attemptId = json._id
        }
            )
        .catch(error => console.log(error))
}
                    
const questionArr = document.querySelector(".question-arr")

function renderQuestion(json) {
    let questions = json.questions;
    for (let i = 0; i < questions.length; i++) {
        const questionIndex = document.createElement("h2")
        questionIndex.className = "question-index"
        questionIndex.textContent = ["Question " + (i+1) + " of " + (questions.length)]
        questionArr.appendChild(questionIndex)
        const questionText = document.createElement("p")
        questionText.className = "question-text"
        questionText.textContent = questions[i].text
        questionArr.appendChild(questionText)
        const optionBox = document.createElement("div")
        optionBox.className = "option-box"
        optionBox.id = questions[i]._id
        questionArr.appendChild(optionBox)
        for (let j = 0; j < questions[i].answers.length; j++) {
            const option = document.createElement("div")
            option.className = "option"
            const input = document.createElement("input")
            input.className = "opt"
            input.name = "choice"+(i+1)
            input.type = "radio"
            input.id = "q"+(i+1)+"-opt"+(j+1)
            const label = document.createElement("label")
            label.className = "option"+(j+1)
            label.textContent = questions[i].answers[j]
            optionBox.appendChild(option)
            option.appendChild(input)
            option.appendChild(label)      
        }
    }

    const optionBox = document.querySelectorAll("#attempt-quiz .option-box");
    for (let question of optionBox){
        const optionChecked = question.querySelectorAll(".option");
        for (let option of optionChecked){
            option.addEventListener("click", function(){
                for (let answer of optionChecked){
                    answer.classList.remove("checked");
                    answer.children[0].checked = false;
                }
                option.children[0].checked = true; 
                option.classList.add("checked");
            });
        }
    }
}


function submitClick() {
    
    const confirmation = confirm("Do you want to submit the answer?");
    let result = {}
    attempQuiz.classList.add("hidden")
    reviewQuiz.classList.remove("hidden")
    introduction.classList.add("hidden")
    body.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    

    let optionContainer = document.querySelectorAll(".option-box")
    for (let i = 0; i<optionContainer.length; i++) {
        let answers = optionContainer[i].querySelectorAll("input[type='radio']")
        let questionId = optionContainer[i].id
        for (let j = 0; j<answers.length; j++) {
            if (answers[j].checked)
                result[questionId] = j;
        } 
    }
    const userAnswers = {userAnswers : result}
    
    fetch(`http://localhost:3000/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" },
        body : JSON.stringify(userAnswers)
    })
        .then(response => response.json())
        .then(json => renderAnswer(json))
        .catch(error => console.log(error))
}

const reviewQuestion = document.querySelector(".reviewQuestion")


function renderAnswer(json) {
    let questions = json.questions;
    let correctAnswers = json.correctAnswers
    let userAnswers = json.userAnswers
    
    for (let i = 0; i < questions.length; i++) {
        const questionIndex = document.createElement("h2")
        questionIndex.className = "question-index"
        questionIndex.textContent = ["Question " + (i+1) + " of "+ (questions.length)]
        reviewQuestion.appendChild(questionIndex)
        const questionText = document.createElement("p")
        questionText.className = "question-text"
        questionText.textContent = questions[i].text
        reviewQuestion.appendChild(questionText)
        const optionBox = document.createElement("div")
        optionBox.className = "option-box"
        optionBox.id = questions[i]._id
        reviewQuestion.appendChild(optionBox)
        const labelCorrect = document.createElement("label")
        labelCorrect.className = "correct-answer-label"
        labelCorrect.textContent = "Correct answer"
        const labelWrong = document.createElement("label")
        labelWrong.className = "correct-answer-label"
        labelWrong.textContent = "Your answer"
        

        let index_correctAnswer
        let index_userOptions 

        if (userAnswers) {
            index_userOptions = userAnswers[json.questions[i]._id]
        }
        index_correctAnswer = correctAnswers[json.questions[i]._id]
        for (let j = 0; j < questions[i].answers.length; j++) {
            const option = document.createElement("div")
            option.className = "option_review"
            const input = document.createElement("input")
            input.className = "opt"
            input.name = "choice"+(i+1)
            input.type = "radio"
            input.id = "q"+(i+1)+"-opt"+(j+1)
            input.disabled = true
            if (userAnswers && j == index_userOptions ) {
                input.checked = true
                if (index_correctAnswer == index_userOptions) {
                    option.classList.add("correct-answer")
                    option.appendChild(labelCorrect)
                } else {
                    option.classList.add("wrong-answer")
                    option.appendChild(labelWrong)
                } 
            } else {
                if (j == index_correctAnswer) {
                    option.classList.add("option-correct")
                    option.appendChild(labelCorrect)
                }
            }
            const label = document.createElement("label")
            label.className = "option"+(j+1)
            label.textContent = questions[i].answers[j]
            optionBox.appendChild(option)
            option.appendChild(input)
            option.appendChild(label)      
        }

    }
    let scoretext = json.scoreText
    let scoree = json.score
    let score = document.createElement("p")
    let mark = (scoree/(questions.length)*100).toFixed(2);
    score.className = "score"
    score.textContent = scoree+"/"+(questions.length)
    resultShow.appendChild(score)
    let percentages = document.createElement("p")
    percentages.className = "percentages"
    percentages.textContent = mark+"%"
    resultShow.appendChild(percentages)
    let scoreText = document.createElement("p")
    scoreText.className = "scoreText"
    scoreText.textContent = scoretext
    resultShow.appendChild(scoreText)

    
}

function reviewClick() {
    attempQuiz.classList.add("hidden")
    reviewQuiz.classList.add("hidden")
    introduction.classList.remove("hidden")
    questionArr.innerHTML = ""
    reviewQuestion.innerHTML = ""
    resultShow.innerHTML = ""
    body.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
}


function addClick() {
    introduction.classList.add("hidden")
    addQuiz.classList.remove("hidden")
}

function addQuizClick() {
    const form = document.querySelector(".quiz-form");
  
    // Create a new FormData object and append the form input values
    const formData = new FormData(form);
  
    fetch("http://localhost:3000/attempts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
  


startBtn.addEventListener("click", startClick)
addBtn.addEventListener("click", addClick)
reviewBtn.addEventListener("click", reviewClick)
submitBtn.addEventListener("click", submitClick)
addQuizBtn.addEventListener('click', addQuizClick)




