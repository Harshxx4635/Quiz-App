const questionText = document.querySelector('#question');
const text = document.querySelector('#text');
let ans;
const btn = document.querySelector('button');

let div;

let n = 10;

let idx=1;

let results = [];

const arr = new Array(n);

document.addEventListener('DOMContentLoaded', () => {
    start();
})

function start() {
    idx=1;
    results = [];
    if(btn.parentElement.previousElementSibling.classList.contains('answers')) {
        btn.parentElement.previousElementSibling.remove();
    }
    questionText.innerHTML = "WELCOME TO THE QUIZ"
    btn.innerHTML = "CONTINUE"
    questionText.style.textDecoration = "underline"
    text.innerHTML = "INSTRUCTIONS:"
    text.classList.add('question');
    div = document.createElement('div');
    div.innerHTML=`1. All Questions are MCQs(Multiple Choice Questions).<br>2. Select the option that you think is correct and click "NEXT".<br>3. You cannot revisit a question.<br>4. Your final score will be displayed at the end.<br>Click "CONTINUE" to begin the quiz.`
    div.classList.add('answers');
    div.style.height = "40%";
    div.style.fontSize = "1.4rem"
    div.style.color = "#fff"
    div.style.lineHeight = "30px"
    text.insertAdjacentElement('afterend',div);
    fetch(`https://opentdb.com/api.php?amount=${n}&category=9&difficulty=easy&type=multiple`).then(res => res.json()).then(data => {
        let index = 0;
        Array.from(data.results).forEach(d => {
            let obj = {};
            obj.question = d.question;
            d.incorrect_answers.push(d.correct_answer);
            obj.correct = d.incorrect_answers[3];
            let ans_array = shuffle(d.incorrect_answers);
            ans=document.createElement('div');
            ans.classList.add('answers');
            ans.innerHTML= `
            <ul>
                <li><input  name="answer" id="a" type="radio" class="option"><label id="a-text" for="a">${ans_array[0]}</label></li>
                <li><input name="answer" id="b" type="radio" class="option"><label id="b-text" for="b">${ans_array[1]}</label></li>
                <li><input  name="answer" id="c" type="radio" class="option"><label id="c-text" for="c">${ans_array[2]}</label></li>
                <li><input  name="answer" id="d" type="radio" class="option"><label id="d-text" for="d">${ans_array[3]}</label></li>
            </ul>
            `
            obj.div = ans;
            arr[index++] = obj
        })
    }).catch(e => {
        console.log(e);
        alert("API is not working. Please try again later")
        btn.setAttribute('disabled', true);
        btn.style.cursor = "not-allowed";
    })
}

function shuffle(array) {
    const shuffledArray = [...array]; 
  
    let currentIndex = shuffledArray.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex], shuffledArray[currentIndex]
      ];
    }
    return shuffledArray;
  }

function endQuiz() {
    btn.innerHTML = "PLAY AGAIN"
    let endDiv = document.createElement('div');
    endDiv.classList.add('answers');
    questionText.innerHTML = "RESULTS"
    let count = 0;
    results.forEach(r => {
        if(r.isCorrect) count++;
    })
    let c = 1;
    endDiv.innerHTML = `
    <table>
    <thead>
      <tr>
        <th scope="col">Question No.</th>
        <th scope="col">Your Answer</th>
        <th scope="col">Correct Answer</th>
        <th scope="col">Score</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(r =>`<tr>
        <th scope="row">${c++}</th>
        <td>${r.answer}</td>
        <td>${r.correct_answer}</td>
        <td>${r.isCorrect ? `1`: `0`}</td>
        </tr>`
      ).join('')}
    </tbody>
    <tfoot>
      <tr>
        <th scope="row" colspan="3">Total Score</th>
        <td>${count}</td>
      </tr>
    </tfoot>
  </table>`
    btn.parentElement.previousElementSibling.remove();
    btn.parentElement.insertAdjacentElement('beforebegin',endDiv);
}



btn.addEventListener('click', (e) => {
    if(btn.innerHTML==="CONTINUE") {
        div.style.display = "none"
        text.style.display = "none";
        questionText.innerHTML = `Question 1: ${arr[0].question}`
        btn.parentElement.insertAdjacentElement('beforebegin',arr[0].div);
        btn.innerHTML= "NEXT";
    } else if(btn.innerHTML==="NEXT") {
        let flag = 0;
        document.querySelectorAll('.option').forEach(o => {
            if(o.checked) {
                flag = 1;
                if(arr[idx-1].correct === o.nextElementSibling.innerHTML) {
                    results.push({
                        answer: o.nextElementSibling.innerHTML,
                        correct_answer: arr[idx-1].correct,
                        isCorrect: true
                    })
                } else {
                    results.push({
                        answer: o.nextElementSibling.innerHTML,
                        correct_answer: arr[idx-1].correct,
                        isCorrect: false
                    })
                }
            }
        })
        console.log(results);
        if(flag === 0) {
            return alert("Please select an option");
        }
        if(idx < n) {
            questionText.innerHTML = `Question ${idx+1}: ${arr[idx].question}`
            btn.parentElement.previousElementSibling.remove();
            btn.parentElement.insertAdjacentElement('beforebegin',arr[idx].div);
            idx++;
        } else {
            endQuiz();
        }
    } else if(btn.innerHTML==="PLAY AGAIN") {
        text.style.display = "flex";
        start();
    }

})