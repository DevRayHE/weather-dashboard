var questionEl = document.getElementById("question");
// document.querySelector("#question")
var answer1El = document.getElementById("answer1");
var answer2El = document.getElementById("answer2")
var answer3El = document.getElementById("answer3")
var answer4El = document.getElementById("answer4")


// Stores questions in an array of objects
var questions = [
    {
        question: "whats's our star?",
        answer: ["the sun", "b", "c"],
        correctAnswer: 0,
    },
    {
        question: "whats's our star?",
        answer: ["the sun", "b", "c"],
        correctAnswer: 0,
    },
    {
        question: "whats's our star?",
        answer: ["the sun", "b", "c"],
        correctAnswer: 0,
    }
];

var currentQuestionIndex = 0;

function updateQuestion () {
    var question = questions[currentQuestion];

    questionEl.innerText = currentQuestion.question;
    answer1El.innerText = currentQuestion.answers[0];
    answer2El.innerText = currentQuestion.answers[1];
    answer3El.innerText = currentQuestion.answers[2];
    answer4El.innerText = currentQuestion.answers[3];

    currentQuestionIndex++;
}

function checkAnswer (clickedAnswer) {
    var currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.correctAnswer === clickedAnswer) {
        console.log("correct answer");
    }
    else {
        console.log("wrong answer");
    }

    currentQuestionIndex++;
    updateQuestion ();
}

answer1El.addEventListener("click", function () {
    checkAnswer(0);
});
answer2El.addEventListener("click", function () {
    checkAnswer(1);
});
answer3El.addEventListener("click", function () {
    checkAnswer(2);
});
answer4El.addEventListener("click", function () {
    checkAnswer(3);
});


updateQuestion();