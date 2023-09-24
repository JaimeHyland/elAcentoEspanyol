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

let collapsibleColorScheme =[['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd']];
let lessonLinkColorScheme = [['#fabe00', '#6d4038'], ['#008bae', '#f2f3ae'], ['#be4334', '#f7eedd'], ['#eed090', '#2e744b'],['#2e744b', '#eed090']];

console.log(document.getElementsByClassName('collapsible')[0]);
console.log(collapsibleColorScheme);
chooseColorSchemes(document.getElementsByClassName('collapsible'), collapsibleColorScheme);
chooseColorSchemes(document.getElementsByClassName('link-to-lesson'), lessonLinkColorScheme);
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
            document.getElementById("running-total").innerHTML = `This is the first question; you have this and just one more question to do! Good luck!`;
        } else if (currentQuestion === 1) {
            //three questions or more; this is the first one
            document.getElementById("running-total").innerHTML = `This is your first question! There are ${totalQuestions} questions in total!`;
        } else {
            //allow for singulars and plurals in messages to user
            let _questionsCorrectString = "questions";
            let _questionsLeftString = "questions";

            if (correctAnswers === 1) {
                questionsCorrectString = "question";
            };
            if (questionsLeft === 1) {
                questionsLeftString = "question";
            };
            document.getElementById("running-total").innerHTML = `You have answered ${correctAnswers} ${_questionsCorrectString} correctly out of 
                ${questionsCompleted} so far; you have ${questionsLeft} ${_questionsLeftString} left to do!`;
        }
    }
}

// run click handler when user clicks on an answer-option

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
                    finished = true;
                    announceResults(quizStats);
                }
            }
        }
    });
}

function evaluateAnswer(idString) {
    let _answerId = idString.split("-");
    with (quizStats) {
        if (_answerId[1] === "true") {
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
    with (quizStats) {
        if (correctAnswers === totalQuestions) {
            _feedbackString = "Perfect score! Congratulations!";
        } else if (correctAnswers >= totalQuestions * .75) {
            _feedbackString = "Not bad! Keep up the good work!";
        } else if (correctAnswers >= totalQuestions * .5) {
            _feedbackString = "This still needs a little work! Take another look at the rules!";
        } else {
            _feedbackString = "If you'd chosen your answers at random, you'd probably have done better! I'm afraid it's back to the drawing board!";
        };
        // allow for singular and plurals in result
        let _questionsCorrectString = "questions";
        if (correctAnswers === 1) {
            _questionsCorrectString = "question";
        };
        if (totalQuestions === 1) {
            if (correctAnswers === 0) {
                document.getElementById("running-total").innerHTML = `Hard luck! You got the question wrong!`;
            } else {
                document.getElementById("running-total").innerHTML = `Well done! That's correct!`;
            }
        } else  {
            document.getElementById("running-total").innerHTML = `You answered ${correctAnswers} ${_questionsCorrectString} correctly out of 
        ${totalQuestions}. <br>${_feedbackString}`;
        };
    }
}

var collapsible = document.getElementsByClassName("collapsible");
var i;

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

function chooseColorSchemes(divArray, colorSchemeArray) {
    let colorSchemeNum = genUnorderedIntArray(0, divArray.length - 1);
    console.log('divArray[0]: ' + divArray[0]);
    console.log("colorSchemeArray: " + colorSchemeNum);
    for(let i in colorSchemeNum) {
        console.log(divArray[i]);
        console.log("colorScheme: " + colorSchemeArray[colorSchemeNum[i]][0]);
        divArray[i].style.backgroundColor = colorSchemeArray[colorSchemeNum[i]][0];
        divArray[i].style.color = colorSchemeArray[colorSchemeNum[i]][1];
        console.log(divArray[i]);
        console.log(colorSchemeArray[colorSchemeNum[i]]);
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
    for(let i = from; i <= to; i++) {
      result.push(i);
    }
    console.log(result);
    return result;
  }


