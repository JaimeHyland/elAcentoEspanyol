let quizData;
let questionCount;

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

function createAnswerDivs(questionCount) {
    let htmlString = "";
    for (const i in quizData.questions[questionCount].answers) {
        htmlString += `<div class="answer-option">` + quizData.questions[questionCount].answers[i][0] + `</div>`;
    }
    document.getElementById('answer-options').innerHTML = htmlString;
}

function fillQuestion(questionCount) {
    document.getElementById('question-text').innerHTML = quizData.questions[questionCount].question;
    createAnswerDivs(questionCount);
}
