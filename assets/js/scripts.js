import questionData from './quiz.json' assert {type: 'json'};
let quizStats = {
    'totalQuestions': 0,
    'questionsPerQuiz': 10,
    'currentQuestion': 0,
    'questionsCompleted': 0,
    'questionsRemaining': 0,
    'correctAnswers': 0,
    'incorrectAnswers': 0,
    'finished': false,
    'started': false,
};

let fullQuizData = QuestionsFromData(questionData);
let quizData = shuffleAndSelectQuestions(fullQuizData, quizStats.questionsPerQuiz);

//Simply reads in the questions from the full data imported from quiz.json
function QuestionsFromData(data) {
    const quizQuestions = data.questions;
    return quizQuestions;
}

//shuffles the questions and returns the first num of them, deleting the ones it has selected.
function shuffleAndSelectQuestions(questions, num) {
    for (let i = questions.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    questions = questions.slice(0, num);
    console.log(questions[0])
    return questions;
}

function reinitializeQuiz() {
    quizStats.totalQuestions = 0;
    quizStats.currentQuestion = 0;
    quizStats.questionsCompleted = 0;
    quizStats.questionsRemaining = 0;
    quizStats.correctAnswers = 0;
    quizStats.incorrectAnswers = 0;
    quizStats.finished = false;
    quizStats.started = false;
};

//Colors for randomly colored buttons
let modalOpen = false; //only one modal may open at at time!
let collapsibleColorScheme = [['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd'], ['#eed090', '#2e744b'], ['#2e744b', '#eed090']];
let lessonLinkColorScheme = [['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd'], ['#eed090', '#2e744b'], ['#2e744b', '#eed090']];


// Event handler for quiz button
document.getElementById("start-quiz-btn").addEventListener("click", function () {
    if (quizStats.finished) {
        gatherQuizStats();
    } else {
        showHideQuiz();
    }
});

//Hide the quiz by default on startup. Needs event handler to ensure quiz is created first.
document.getRootNode().addEventListener("DOMContentLoaded", function () {
    showHideQuiz();
});

//Event handler for info link icon on header
document.getElementById("link-to-info-modal").addEventListener("click", function () {
    if (modalOpen === false) {
        document.getElementById("how-to-use").style.display = "block";
    }
});

// Add event handlers for links to summary flash cards
function addEventListenersToSummaryLinks() {
    let linkDivs = document.getElementsByClassName("link-for-summary");
    for (let i = 0; i < linkDivs.length; i++) {
        let summaryNum = i + 1;
        linkDivs[i].addEventListener("click", function () {
            document.getElementById("summary" + summaryNum).style.display = "block";
        });
    }
}

//The if condition fires if the quiz-title is visible or if its style.display member is as yet undefined (the latter for first firing)
function showHideQuiz() {
    if (document.getElementById("quiz-title").style.display === "block" || document.getElementById("quiz-title").style.display.length === 0) {
        document.getElementById("quiz-title").style.display = "none";
        document.getElementById("question-container").style.display = "none";
        document.getElementById("quiz-score").style.display = "none";
        document.getElementById("start-quiz-btn").innerHTML = "Show revision quiz";
    } else {
        document.getElementById("quiz-title").style.display = "block";
        document.getElementById("question-container").style.display = "flex";
        document.getElementById("quiz-score").style.display = " block";
        document.getElementById("start-quiz-btn").innerHTML = "Hide quiz";
    }
}


//quizStats shows the stats for the current quiz. quizData contains the full data from the json file.
function gatherQuizStats() {
    reinitializeQuiz();
    console.log(quizData[0])
    quizStats.totalQuestions = quizData.length;
    quizStats.questionsRemaining = quizStats.totalQuestions;
    console.log(quizStats.questionsRemaining)
    fillQuestion(quizStats.currentQuestion);
}
/**
 * 
 * @param {object} data  must be in the form of a quiz json file
 * @param {object} stats must be in the form of a quiz stats file
 */
function chooseQuestions(data, stats) {
    let questionNumArray = genUnorderedIntArray(stats.questionsPerQuiz);
    for (let i in questionNumArray) {
        questionArray[i].question = data.questions.question[questionNumArray];
    }
}

/**
 * 
 * @param {integer} count ... Any number of answers are possible to each question (though more than four short ones will cause presentation problems)!
 */
function createAnswerDivs(count) {
    let htmlString = "";
    for (let i in quizData[count].answers) {
        // the id of the answer div identifies its position in the div array and tells whether it's the correct answer or not.
        htmlString += `<button id="` + i + `-` + quizData[count].answers[i][1] + `" class="answer-option">` + quizData[count].answers[i][0] +
            `</button>`;
    }

    document.getElementById('answer-options').innerHTML = htmlString;
}

/**
 * 
 * @param {integer} count The number of questions contained in the quiz.
 */
function fillQuestion(count) {
    console.log("count: " + count)
    document.getElementById('question-text').innerHTML = quizData[count].question;
    createAnswerDivs(count);
    quizStats.currentQuestion++;
    console.log("currentQuestion: " + quizStats.currentQuestion);
    quizStats.started = true;
    if (quizStats.totalQuestions === 1) {
        // Just one question
        document.getElementById("running-total").innerHTML = `This is the first and only question in the quiz. Good luck!`;
    } else if (quizStats.currentQuestion === 1 && quizStats.questionsRemaining === 1) {
        // just two questions; this is the first one
        document.getElementById("running-total").innerHTML = `This is the first question; you have this and just one more question to do! Good luck!`;
    } else if (quizStats.currentQuestion === 1) {
        //three questions or more; this is the first one
        document.getElementById("running-total").innerHTML = `This is your first question! There are ${quizStats.questionsRemaining} questions in total!`;
    } else {
        //allow for singulars and plurals in messages to user
        let questionsCorrectString = "questions";
        let questionsRemainingString = "questions";

        if (quizStats.correctAnswers === 1) {
            questionsCorrectString = "question";
        };
        if (quizStats.questionsRemaining === 1) {
            questionsRemainingString = "question";
        };
        document.getElementById("running-total").innerHTML = `You have answered ${quizStats.correctAnswers} ${questionsCorrectString} correctly out of 
                ${quizStats.questionsCompleted} so far; you have ${quizStats.questionsRemaining} ${questionsRemainingString} left to do!`;
    }
}

// Run click handler when user clicks on an answer-option
function setupAnswerClickHandler() {
    document.getElementById('answer-options').addEventListener('click', function (event) {
        // Check if clicked element is a button, do nothing if it's not.
        if (event.target.tagName === "BUTTON") {
            evaluateAnswer(event.target.id);
            // Perform your actions here
            if (quizStats.currentQuestion < quizStats.totalQuestions) {
                quizStats.questionsRemaining--;
                quizStats.questionsCompleted++;
                fillQuestion(quizStats.currentQuestion);
            } else {
                announceResults(quizStats);
                console.log("Finished on evaluating last answer: " + quizStats.finished);
            }
        }
    });
}

function evaluateAnswer(idString) {
    const answerId = idString.split("-");
    if (answerId[1] === "true") {
        quizStats.correctAnswers++;
        document.getElementById(idString).style.backgroundColor = 'green';
    } else {
        quizStats.incorrectAnswers++;
        document.getElementById(idString).style.backgroundColor = 'red';
    }
}

function announceResults(stats) {
    document.getElementById('question-text').innerHTML = "<em>You've finished the quiz!</em>";
    document.getElementById('answer-options').innerHTML = "";
    let feedbackString;
    if (stats.correctAnswers === stats.totalQuestions) {
        feedbackString = "Perfect score!";
        document.getElementById('answer-options').innerHTML = "<h2>¡Enhorabuena!</h2>";
    } else if (stats.correctAnswers >= stats.totalQuestions * .75) {
        feedbackString = "Not bad! Keep up the good work!";
        document.getElementById('answer-options').innerHTML = "<h2>¡Bien hecho!</h2>";
    } else if (stats.correctAnswers >= stats.totalQuestions * .5) {
        feedbackString = "This still needs a little work! Take another look at the rules!";
        document.getElementById('answer-options').innerHTML = "<h2>¡Sigue en ello!</h2>";
    } else {
        feedbackString = "If you'd chosen your answers at random, you'd probably have done better! I'm afraid it's back to the drawing board!";
        document.getElementById('answer-options').innerHTML = "<h2>¡Ups!</h2>";
    };
    // allow for singular and plurals in result
    stats.questionsCorrectString = "questions";
    if (stats.correctAnswers === 1) {
        stats.questionsCorrectString = "question";
    };
    if (stats.totalQuestions === 1) {
        if (correctAnswers === 0) {
            document.getElementById("running-total").innerHTML = `Hard luck! You got the question wrong!`;
        } else {
            document.getElementById("running-total").innerHTML = `Well done! That's correct!`;
        }
    } else {
        document.getElementById("running-total").innerHTML = `You answered ${stats.correctAnswers} ${stats.questionsCorrectString} correctly out of 
        ${stats.totalQuestions}. <br>${feedbackString}`;
    };
    document.getElementById("start-quiz-btn").innerHTML = "Do the quiz again";
    quizStats.finished = true;
}

function implementCollapsibleTexts(className) {
    var collapsible = document.getElementsByClassName(className);
    for (let i = 0; i < collapsible.length; i++) {
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
}

function chooseColorSchemes(divArray, colorSchemeArray) {
    let colorSchemeNum = genUnorderedIntArray(0, divArray.length - 1);
    for (let i in colorSchemeNum) {
        divArray[i].style.backgroundColor = colorSchemeArray[colorSchemeNum[i]][0];
        divArray[i].style.color = colorSchemeArray[colorSchemeNum[i]][1];
    }
}

//Create an array of integers and mix em up!
function genUnorderedIntArray(from, to) {
    const array = genOrderedIntArray(from, to);

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
function genOrderedIntArray(from, to) {
    if (from > to) {
        throw new Error("Error: from value is greater than end value!");
    }

    let result = []
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
}

chooseColorSchemes(document.getElementsByClassName('collapsible'), collapsibleColorScheme);
chooseColorSchemes(document.getElementsByClassName('link-for-summary'), lessonLinkColorScheme);
gatherQuizStats();
setupAnswerClickHandler();
addEventListenersToSummaryLinks();
implementCollapsibleTexts("collapsible");
implementCollapsibleTexts("xtraCollapsible");