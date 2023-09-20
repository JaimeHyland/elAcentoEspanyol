let quizData;
let numQuestions = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

setupClickHandler();

async function fetchQuizFile() {
    try {
        const response = await fetch('./quiz.json');
        quizData = await response.json();
        console.log(quizData);
        numQuestions = quizData.questions.length;
        console.log(numQuestions);
        for (const key in quizData.questions) {
            console.log(quizData.questions[key].question);
            for (const key1 in quizData.questions[key].answers) {
                console.log(quizData.questions[key].answers[key1][0] + ': ' + quizData.questions[key].answers[key1][1]);
            }
        }
    } catch (error) {
        console.log(error);
    }
    fillQuestion(0);
}

function createAnswerDivs(count) {
    let htmlString = "";
    for (const i in quizData.questions[count].answers) {
        console.log(quizData.questions[count].answers[i][1]);
        // the id of the answer div identifies its position in the div array and tells whether it's the correct answer or not.
        htmlString += `<button id="` + i + `-` + quizData.questions[count].answers[i][1] + `" class="answer-option">` + quizData.questions[count].answers[i][0] +
            `</button>`;
        console.log(htmlString);
    }
    document.getElementById('answer-options').innerHTML = htmlString;
}

function fillQuestion(count) {
    document.getElementById('question-text').innerHTML = quizData.questions[count].question;
    createAnswerDivs(count);
}

// evaluate click/tap on answer-options div

function setupClickHandler() {
    document.getElementById('answer-options').addEventListener('click', function (event) {
        // Check if clicked element is button
        if (event.target.tagName === "BUTTON") {
            evaluateAnswer(event.target.id);
            // Perform your actions here
            console.log('You clicked on the button with ID: ' + event.target.id);
        }
    });
}

function evaluateAnswer(idString) {
    let answerId = idString.split("-");
    console.log(idString);
    console.log(answerId[1]);
    if (answerId[1]==="true") {
        correctAnswers++;
        document.getElementById(idString).style.backgroundColor = 'green';
    } else {
        incorrectAnswers++;
        document.getElementById(idString).style.backgroundColor = 'red';
    }
    console.log(correctAnswers);
    
    document.getElementById("running-total").innerHTML = `$correctAnswers out of $currentQuestion; still $numQuestions-currentQuestion to go!`
}

function goToNextQuestion() {
    //    evaluateAnswer(currentQuestion);
    //   currentQuestion ++;
    //    correctAnswers =+ evaluateAnswer();
    //    evaluateAnswer(currentQuestion);
    //    totScore(currentQuestion);
}




function totScore(count) {

}

var collapsible = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}


