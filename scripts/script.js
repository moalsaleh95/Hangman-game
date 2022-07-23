let lives = 6;
const preview = document.querySelector("preview")
const hint = document.getElementById("hint")
const guessTable = document.getElementsByClassName("guess")
const btnHint = document.getElementById("btn-hint")
const letters = document.getElementsByName("btns");
const portrait = document.getElementById("portrait");
const btnRefresh = document.getElementById("refresh");
const overlayGame = document.getElementById("text")
const overlay = document.getElementById("overlay")
const bigContainer = document.getElementById("big-container")

//set the default image

portrait.innerHTML = `<img src="./images/default.jpg" alt="" class="m-auto" style="height: fit-content ; width: 40%;">`


const btnContainer = document.getElementById("btn-container");
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
for ([i, letter] of Object.entries(alphabet)) {
    btnContainer.innerHTML += `<button type="button" id="btn${i}" name = "btns" class="alph-btn col-lg-1 mx-2 my-3 col-md-4 btn btn-secondary fs-4" style= "width: 10%">${letter}</button>`
    // console.log(document.getElementById(`btn${i}`).innerText)
}



var word = []
const fetchWord = () => {
    return fetch("https://random-word-api.herokuapp.com/word?number=1")
        .then(word => word.json())
        .then((randomWord) => {
            console.log(randomWord)
            word = randomWord[0].split('')
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${randomWord}`)
                .then(response => {
                    if (!response.ok) {
                        hint.innerHTML = (`No Available Hint for The current word, You are on your own now :(`)
                        throw "Sorry Pal, this is not a spelling Bee competition"
                    }
                    return response.json()
                })
                .then(arr => {

                    const def = arr[0]?.meanings[0].definitions["0"].definition;
                    btnHint.addEventListener('click', () => {
                        hint.innerHTML = (`Hint: ${def}`)

                    })

                })

        })
}

result = function () {
    wordHolder = document.getElementsByClassName('preview')[0];
    correct = document.createElement('ul');

    for (var i = 0; i < word.length; i++) {
        correct.setAttribute('id', 'my-word');

        guess = document.createElement('li');
        guess.setAttribute('class', 'guess col-sm-1 col-md-1 col-lg-2 col-xl-1');


        guess.innerHTML = "_";

        wordHolder.appendChild(correct);
        correct.appendChild(guess);
    }
    // Handle the Click on the Alphabet Buttons.
    letters.forEach(e => {
        e.addEventListener('click', (e) => {
            let indices = []
            let letter = e.target.innerText.toLowerCase();
            if (word.includes(letter)) {
                let letterIndex = word.indexOf(letter)
                while (letterIndex != -1) {
                    indices.push(letterIndex);
                    letterIndex = word.indexOf(letter, letterIndex + 1);
                }
                for (index of indices) {
                    guessTable[index].innerHTML = letter
                }
                comments()
                //    console.log(`pressed letter ${letter} at index ${letterIndex}`)
            }
            else {
                lives--
                console.log(lives)
                if (lives >= 0) {
                    updateImage()
                }


                // IMPORTANT!!!  HERE YOU SHOULD ADD A FUNCTION TO BURN THE MAN!
                //***********  */
                //*********** */

                // console.log(`pressed letter ${letter}${lives}`)
            }
            comments()
        })
    })
}

//counts number of lives remaining:

const comments = () => {

    let winCount = 0;
    livesCounter = document.getElementById("lives");
    if (lives >= 0) {
        livesCounter.innerHTML = "Lives Remaining: " + lives;
    }

    if (lives < 1) {
        console.log("worked")
        on()
        overlayGame.innerHTML = "Game Over 🔥";



    }
    else {

        for (let i = 0; i < guessTable.length; i++) {

            if (guessTable[i].innerHTML === "_") {
                break
            }
            else winCount++
        }
        if (winCount === guessTable.length) {
            overlayGame.innerHTML = "You Win! 🙃 ";
        }
    }
}

async function startGame() {
    const loadWord = await fetchWord()
    await result()
}



function updateImage() {
    portrait.innerHTML = `<img src="./images/${lives}.jpg" alt="" class="" style="height: 45vh; width: fit-content;">`
}

function on() {

    overlay.style.display = "block";
    bigContainer.style.display = "none";
}

function off() {
    overlay.style.display = "none";
    bigContainer.style.display = "block";
}




startGame()




