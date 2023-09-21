let quiz; //The object containing the entire quiz.
let quizStats = {
    totalQuestions: 0,
    currentQuestion: 0,
    questionsCompleted: 0,
    questionsLeft: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    finished: false,
    started: false
};

setupClickHandler();

async function fetchQuizFile() {
    try {
        const response = await fetch('./quiz.json');
        quiz = await response.json();
        numQuestions = quiz.questions.length;
        for (const key in quiz.questions) {
            for (const key1 in quiz.questions[key].answers) {
            }
        }
    } catch (error) {
        console.log(error);
    }
    readinQuizStats(quiz);
    fillQuestion(quizStats.currentQuestion);
}

function readinQuizStats(myQuiz) {
    with (quizStats) {
        totalQuestions = myQuiz.questions.length;
        questionsLeft = totalQuestions;
    }
}

function createAnswerDivs(_count) {
    let htmlString = "";
    with (quiz) {
        for (let i in questions[_count].answers) {
            // the id of the answer div identifies its position in the div array and tells whether it's the correct answer or not.
            htmlString += `<button id="` + i + `-` + questions[_count].answers[i][1] + `" class="answer-option">` + questions[_count].answers[i][0] +
                `</button>`;
        }
    }
    document.getElementById('answer-options').innerHTML = htmlString;
}

function fillQuestion(_count) {
    document.getElementById('question-text').innerHTML = quiz.questions[_count].question;
    createAnswerDivs(_count);
    with (quizStats) {
        currentQuestion++;
        started = true;
        if (totalQuestions === 1) {
            // Just one question
            document.getElementById("running-total").innerHTML = `This is the first and only question in the quiz. Good luck!`;
        } else if (currentQuestion === 1 && questionsLeft === 1) {
            // just two questions; this is the first one
            document.getElementById("running-total").innerHTML = `This is the first question; you have this and just more one question to go! Good luck!`;
        } else if (currentQuestion === 1) {
            //three questions or more; this is the first one
            document.getElementById("running-total").innerHTML = `This is your first question! There are ${totalQuestions} questions in total!`;
        } else if (questionsLeft === 1) {
            //three questions or more, one question left.
            document.getElementById("running-total").innerHTML = `You have answered ${correctAnswers} questions correctly out of 
            ${questionsCompleted} so far; you have just ${questionsLeft} question left to do!`;
        } else {
            document.getElementById("running-total").innerHTML = `You have answered ${correctAnswers} questions correctly out of 
            ${questionsCompleted} so far; you still have ${questionsLeft} questions to go!`;
        }
    }
}

// evaluate click/tap on answer-options div

function setupClickHandler() {
    document.getElementById('answer-options').addEventListener('click', function (event) {
        // Check if clicked element is a button, do nothing if it's not.
        if (event.target.tagName === "BUTTON") {
            evaluateAnswer(event.target.id);
            // Perform your actions here
            with (quizStats) {
                if (currentQuestion < totalQuestions) {
                    questionsLeft--;
                    questionsCompleted++;
                    fillQuestion(currentQuestion);
                } else {
                    finished=true;
                    announceResults(quizStats);
                }
            }
        }
    });
}

function evaluateAnswer(idString) {
    let answerId = idString.split("-");
    with (quizStats) {
        if (answerId[1] === "true") {
            correctAnswers++;
            document.getElementById(idString).style.backgroundColor = 'green';
        } else {
            incorrectAnswers++;
            document.getElementById(idString).style.backgroundColor = 'red';
        }
    }
}

function announceResults(quizStats) {
    document.getElementById('question-text').innerHTML = "<em>You've finished the quiz!</em>";
    document.getElementById('answer-options').innerHTML = "";
    let _encouragementString="";
    with (quizStats) {
        if (correctAnswers === totalQuestions) {
            _feedbackString = "Perfect score! Congratulations!";
        } else if (correctAnswers >= totalQuestions * .75) {
            _feedbackString = "Not bad! Keep up the good work!";
        } else if (correctAnswers>=totalQuestions * .5) {
            _feedbackString = "This still needs a little work! Take another look at the rules!";
        } else {
            _feedbackString = "If you'd chosen your answers at random, you would have probably done better! It's back to the drawing board!";
        }
        document.getElementById("running-total").innerHTML = `You have answered ${correctAnswers} questions correctly out of 
        ${totalQuestions}. <br>${_feedbackString}`;
    }
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


