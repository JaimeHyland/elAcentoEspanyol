import jsonData from './quiz.json' assert {type: 'json'};

//Colors for randomly colored buttons and divs. They are identical, but could of course be different!
let modalOpen = false; //only one modal may open at at time!
let collapsibleColorScheme = [['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd'], ['#eed090', '#2e744b'], ['#2e744b', '#eed090']];
let lessonLinkColorScheme = [['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd'], ['#eed090', '#2e744b'], ['#2e744b', '#eed090']];


//quizStats contains the initial values for making each quiz, keeps track of user progress and indicates when the user is finished.
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

let fullQuestionData; //all the quiz questions in the quiz.json file that remain to be put in a quiz
let quizQuestions; //the questions chosen for the current quiz

try {
    fullQuestionData = QuestionsFromData(jsonData);
    quizQuestions = shuffleAndSelectQuestions(fullQuestionData, quizStats.questionsPerQuiz);
} catch (error) {
    window.alert(error + "<br>It looks like the quiz.json file you're using doesn't have any quiz questions in in the right format!");
}


/**
 * 
 * @param {object} data must be an import from a json file containing a questions node
 * @returns the questions from the questions node of the json import
 */
function QuestionsFromData(data) {
    const quizQuestions = data.questions;
    return quizQuestions;
}

//shuffles the questions and returns the first num of them, deleting the ones it has selected.
/**
 * 
 * @param {object} 'questions' the object containing the questions to be shuffled
 * @param {int} 'num' the number of questions you want to extract from the full set of questions
 * @returns a num-sized array of questions in random order
 */
function shuffleAndSelectQuestions(questions, num) {
    if (num > questions.length) {
        num = questions.length;
    }
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    questions = questions.slice(0, num);
    fullQuestionData = fullQuestionData.slice(num, fullQuestionData.length);
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

// Event handler for quiz button
document.getElementById("start-quiz-btn").addEventListener("click", function () {
    if (quizStats.finished) {
        quizQuestions = shuffleAndSelectQuestions(fullQuestionData, quizStats.questionsPerQuiz);
        console.log("fullQuestionData.length; " + fullQuestionData.length)
        gatherQuizStats();
    } else {
        showHideQuiz();
    }
});

//Hides the quiz on startup. Needs event handler to ensure quiz is created first.
document.getRootNode().addEventListener("DOMContentLoaded", function () {
    showHideQuiz();
    hideFlashCards();
    let flashCards = document.getElementsByClassName("summary-modal")
    console.log("DOMContentLoaded event triggered!")
    console.log(flashCards[0].style.display);
    console.log(flashCards[1].style.display);
    console.log(flashCards[2].style.display);
    console.log(flashCards[3].style.display);
    console.log(flashCards[4].style.display);
});

//Event handler for info link icon on header
document.getElementById("link-to-info-modal").addEventListener("click", function () {
    if (modalOpen === false) {
        document.getElementById("how-to-use").style.display = "block";
    }
});

function hideFlashCards() {
    let flashCards = document.getElementsByClassName("summary-modal");
    for (let i = 0; i < flashCards.length; i++)  {
        flashCards[i].style.display = "none";
    }
}

// Add event handlers for links to summary flash cards
function addEventListenersToSummaryLinks() {
    let linkDivs = document.getElementsByClassName("link-for-summary");
    for (let i = 0; i < linkDivs.length; i++) {
        let summaryNum = i + 1;
        linkDivs[i].addEventListener("click", function (Event) {
            let flashCard = document.getElementById("summary" + summaryNum)
            flashCard.style.display = `block`;
            console.log(`flashCard[${summaryNum}].style.display: ` + flashCard.style.display);

            let touch;
            if (Event.touches) {
                touch = Event.touches[0];
            } else {
                touch = Event;
            }

            let fcHeight = flashCard.clientHeight;
            let fcWidth = flashCard.clientWidth;
            let topPosition = touch.clientY - fcHeight/2;
            let leftPosition = touch.clientX - fcWidth/2;
            let fcTop = Math.max(0, topPosition);
            let fcLeft = Math.max(0, leftPosition);
            
        
            flashCard.style.top = `${fcTop}px`;
            flashCard.style.left = `${Math.max(0, )}px`;
            console.log("flashCard[${summaryNum}].style.top: " + flashCard.style.top);
            console.log("flashCard[${summaryNum}].style.left: " + flashCard.style.left);
            document.addEventListener("click", function closeOnClickOutside(e) {
                if (!flashCard.contains(e.target)) {
                    flashCard.style.display = "none";
                    document.removeEventListener("click", closeOnClickOutside);
                    console.log("Event listener added")
                }
            });
        });
    }
}

//The 'if' condition fires if the quiz-title is either visible or not yet set (the latter for first firing)
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


//quizStats shows the stats for the current quiz.
function gatherQuizStats() {
    reinitializeQuiz();
    quizStats.totalQuestions = quizQuestions.length;
    quizStats.questionsRemaining = quizStats.totalQuestions;
    fillQuestion(quizStats.currentQuestion);
}

/**
 * 
 * @param {integer} count ... Any number of answers are possible to each question (though more than four short ones will cause presentation problems)!
 */
function createAnswerDivs(count) {
    let htmlString = "";
    for (let i in quizQuestions[count].answers) {
        // the id of the answer div identifies its position in the div array and tells whether it's the correct answer or not.
        htmlString += `<button id="` + i + `-` + quizQuestions[count].answers[i][1] + `" class="answer-option">` + quizQuestions[count].answers[i][0] +
            `</button>`;
    }

    document.getElementById('answer-options').innerHTML = htmlString;
}

/**
 * 
 * @param {integer} 'count' The number of questions contained in the quiz.
 */
function fillQuestion(count) {
    document.getElementById('question-text').innerHTML = quizQuestions[count].question;
    createAnswerDivs(count);
    quizStats.currentQuestion++;
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
    if (fullQuestionData.length === 0) {
        document.getElementById("start-quiz-btn").disabled = true;
        document.getElementById("start-quiz-btn").style.backgroundColor = 'gray';
        document.getElementById("start-quiz").style.backgroundColor = 'gray';
        document.getElementById("start-quiz-btn").innerHTML = "No questions left";
        document.getElementById("running-total").innerHTML = document.getElementById("running-total").innerHTML + `<br><br><span id="all-done">There are no more questions available for the moment. To start again, refresh the page!</span>`;
    } else {
        document.getElementById("start-quiz-btn").innerHTML = "Do another quiz";
        quizStats.finished = true;
    }
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