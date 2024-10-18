const registrationPage = document.querySelector('.container')
const plyerInfo = document.querySelectorAll('.user')

const quizPage = document.querySelector('.container1')
const triviaForm = document.querySelector('#triviaForm')
const h1 = document.querySelector('#h1')
const greet = document.querySelector('#greeting')
const catogaryP = document.querySelector('.category')
const choosenCatogary = document.querySelector('#chosenCategory')
const playerName = document.querySelector('#playerName')
const difficultyH3Element = document.querySelector('#difficulty')
const difficultyLevel = document.querySelector('#difficultyLevel')
const playerTurn = document.querySelector('#playerTurn')
const questionUlElement = document.querySelector('.question-ul')
const questionNo = document.querySelector('#questionNo')
const options = document.querySelector('#options')
const scoreElement = document.querySelector('#score')
const player1ScorElement = document.querySelector('#player1Score')
const player2ScorElement = document.querySelector('#player2Score')
const questionOptions = document.querySelectorAll('.questionOptions')
const answerCheck = document.querySelector('#answerCheck')

const thirdPage = document.querySelector('.container2')
let continueGame = document.querySelector('#continueGame')
let quitGame = document.querySelector('#quitGame')

const newCategoryPage = document.querySelector('.container3')
const chooseNewCategory = document.querySelector('.chooseNewCategory')
const error = document.querySelector('.error')

const finalPage = document.querySelector('.container4')
const finalSubContainer = document.querySelector('.final')
const finalScore1 = document.querySelector('.final-score1')
const finalScore2 = document.querySelector('.final-score2')
let winnerOfTheGame = document.querySelector('#winner')
const finalButton = document.querySelector('#finalBtn')


let Player1, Player2, player, questions, category, winner;
let player1Score = 0;
let player2Score = 0
let currentPlayer = 1
let questionIndex = 0
let gameRound = 1
let slelectedCatogoryArr = []

// add event listner on start button of home page.
triviaForm.addEventListener('submit', function (event) {
    // it will prevent how actualy submit button works
    event.preventDefault();
    // storing information like both player name and category.
    Player1 = document.getElementById('player1').value;
    Player2 = document.getElementById('player2').value;
    category = document.getElementById('category').value;

    // this add category that we have chosen in selectedCategory
    slelectedCatogoryArr.push(category)
    registrationPage.style.display = 'none';
    quizPage.style.display = 'flex';
    fetchQuestions()
})

//  a function for storing the six questions with chosen category.
async function fetchQuestions() {
    let difficulties = ['easy', 'medium', 'hard'];
    questions = [];
    // Loop through each difficulty and fetch 2 questions for each.
    for (let i = 0; i < difficulties.length; i++) {
        let response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=2&difficulties=${difficulties[i]}`);
        let data = await response.json();
        // apppending questions from data varible into questions.
        questions.push(...data);
    }
    // console.log(questions);
    displayQuizQuestions();
}

// a function for suffling option element in array.
function sortOptionArr(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[randomIndex]
        array[randomIndex] = temp
    }
    return array
}

// function for displaying question one by one chosen of new category.
function displayQuizQuestions() {
    // console.log(`game round is : ${gameRound}`);
    answerCheck.textContent = ''
    options.innerHTML = ''
    
    // storing one question from the question array
    let quizQuestion = questions[questionIndex]
    // console.log(quizQuestion);
    // this will convert difficulty level first level to capital for example :- easy to Easy
    let level = quizQuestion.difficulty.charAt(0).toUpperCase() + quizQuestion.difficulty.slice(1) 

    if(questionIndex % 2 === 0){
        player = Player1
    }else{
        player = Player2
    }

    h1.textContent = `Trivia Quiz Game`
    greet.textContent = `Welcome ${Player1} and ${Player2} in this quiz game.`
    let cat = category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')
    choosenCatogary.textContent = `Category: ${cat}`;
    difficultyLevel.textContent = `Difficulty Level: ${level}`
    playerName.textContent = `${player},  it's your turn! Please answer the given question.`

    let incorrectAns = quizQuestion.incorrectAnswers
    let correctAns = quizQuestion.correctAnswer
    let optionArr = []
    optionArr = [...incorrectAns, correctAns]
    // console.log(optionArr);
    optionArr = sortOptionArr(optionArr)
    // console.log(optionArr);
    questionNo.textContent = `Q. ${questionIndex + 1} ${quizQuestion.question.text}`
    optionArr.forEach((element) => {
        const li = document.createElement('li');
        li.textContent = element;
        options.appendChild(li);
        li.addEventListener('click', () => checkCorrectAns(level, element, correctAns))
    });
}

// function for checking the clicked option is correct or not
function checkCorrectAns(questionLevel, option, correctAnswer) {
    if (option == correctAnswer) {
        answerCheck.textContent = 'Your answer is Correct'
        answerCheck.style.color = 'green'
        if (currentPlayer === 1) {
            if (questionLevel === 'Easy') {
                player1Score += 10
            } else if (questionLevel === 'Medium') {
                player1Score += 15
            } else if (questionLevel === 'Hard') {
                player1Score += 20
            }
        } else if (currentPlayer === 2) {
            if (questionLevel === 'Easy') {
                player2Score += 10
            } else if (questionLevel === 'Medium') {
                player2Score += 15
            } else if (questionLevel === 'Hard') {
                player2Score += 20
            }
        }
    }else{
        answerCheck.textContent = 'Your answer is Incorrect'
        answerCheck.style.color = 'red'
    }

    player1ScorElement.textContent = `Player 1 Score: ${player1Score}`
    player2ScorElement.textContent = `Player 2  Score: ${player2Score}`

    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (questionIndex < questions.length - 1) {
        questionIndex++
        setTimeout(displayQuizQuestions, 2000);

    } else {
        setTimeout(() => {
            if(gameRound < 10){
                quizPage.style.display = 'none'
                thirdPage.style.display = 'flex'
                options.innerHTML = ''
                player1ScorElement.style.marginRight = '18px'
                quitGame.style.marginBottom = '15px';
                quitGame.textContent = 'Quit Game'
                continueGame.textContent = 'Continue Game'
    
                continueGame.addEventListener('click', () => continueTheGame())
                quitGame.addEventListener('click', () => endTheGame(thirdPage))
            }else{
                endTheGame(quizPage)
            }
        }, 2000)
        
    }

}

// a function for continue the page when user clicked on continue page
function continueTheGame() {
    thirdPage.style.display = 'none'
    newCategoryPage.style.display = 'flex';
    questionIndex = 0
}

// event listenr when plyer want to another game with different category.
chooseNewCategory.addEventListener('submit', function (event) {
    event.preventDefault()
    let anotherCat = document.getElementById('newCategory').value
    if (!slelectedCatogoryArr.includes(anotherCat)) {
        error.textContent = ''
        slelectedCatogoryArr.push(anotherCat)
        // console.log(slelectedCatogoryArr);

        quizPage.style.display = 'flex';
        newCategoryPage.style.display = 'none';

        category = anotherCat
        gameRound++

        // empty all element of quiz page: - 
        h1.textContent = ''
        greet.textContent = ''
        choosenCatogary.textContent = ''
        difficultyLevel.textContent = ''
        playerName.textContent = ''
        questionNo.textContent = ''
        player1ScorElement.textContent = ''
        player2ScorElement.textContent = ''
        answerCheck.textContent = ''
        
        fetchQuestions()

    } else {
        error.textContent = 'Choose another category, this category is already in use.';
        error.style.color = 'red';
    
    }
})

// a function for quit the game when user click on quit button 

function endTheGame(page) {
    page.style.display = 'none'
    finalPage.style.display = 'flex'
    finalScore1.textContent = `${Player1} Score: ${player1Score}`
    finalScore2.textContent = `${Player2} Score: ${player2Score}`

    if(player1Score > player2Score){
        winner = `${Player1} has won this quiz game`;
    }else if(player1Score < player2Score){
        winner = `${Player2} has won this quiz game`;
    }else{
        winner = `Game is a tie! You both have equal scores.`;
    }

    winnerOfTheGame.textContent = winner
    finalButton.textContent = 'Back to Home Page'
    finalButton.addEventListener('click', PageReload)
}

// a function for rendering the home page after declaring the winner of game.

function PageReload() {
    location.reload();
}
