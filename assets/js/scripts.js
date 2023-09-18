async function fetchQuizFile() {

    try {
        const response = await fetch('./quiz.json');
        const data = await response.json();
        console.log(data);
        console.log(data.questions);
        console.log(data.questions.length);
        for (const key in data.questions) {
            console.log(data.questions[key].question);
            for (const key1 in data.questions[key].answers) {
                for (const key2 in data.questions[key].answers[key1]) {
                    console.log(data.questions[key].answers[key1][key2]);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
