const moves = document.getElementById("movesCount");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".gameContainer");
const result = document.getElementById("result");
const controls = document.querySelector(".controlsContainer");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// items array
const items = [
  { name: "bluebird", image: "bluebird.png" },
  { name: "butterfly", image: "butterfly.png" },
  { name: "camel", image: "camel.png" },
  { name: "cat", image: "cat.png" },
  { name: "duck", image: "duck.png" },
  { name: "elephant", image: "elephant.jpeg" },
  { name: "goat", image: "goat.png" },
  { name: "lion", image: "lion.jpeg" },
  { name: "lioncartoon", image: "lioncartoon.png" },
  { name: "crocodile", image: "crocodile.jpg" },
];

//  initial time
let seconds = 0,
  minutes = 0;
// initial moves and win count
let movesCount = 0,
  winCount = 0;

//  For timer
const timeGenerator = () => {
  seconds += 1;

  // minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  // format time before display
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// for calculating moves
const movesCounter = () => {
  console.log("inside counter")
  movesCount += 1;
  // console.log("no.of moves counter" +movesCounter);
  // console.log("no.of moves count" + movesCount);
  console.log("no.of moves only" + moves, "and moves count"+movesCount);
  moves.innerHTML = `<span>Moves :</span> ${movesCount}`;
};

// pick random items for the item array
const generateRandom = (size = 4) => {
  // random array
  let tempArray = [...items];
  console.log("tempArray" + tempArray);
  console.log("tempArray length is" + tempArray.length);
  // initializing card values aray
  let cardValues = [];
  size = (size * size) / 2;
  console.log("size value is: " + size);
  // Random items selected
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    console.log("randomIndex value for " + i + "is : " + randomIndex);
    cardValues.push(tempArray[randomIndex]);
    
    // once selected remove the items from the temp array
    tempArray.splice(randomIndex, 1);
  }
  console.log("card value returned from generate random is :" + cardValues);
  movesCounter();
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  console.log("values stored in the card before sort" + cardValues);
  // simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  console.log("values stored in the card after sort" + cardValues);
  for (let i = 0; i < size * size; i++) {
    // Create cards... front --question mark , back --image
    // data card value is the custom attribute which stores the name of the cards to match later
    gameContainer.innerHTML += `
    <div class="card-container" data-card-value="$
    {cardValues[i].name}">
        <div class="card-before">?</div> 
    <div class="card-after"> 
    <img src="${cardValues[i].image}" class="image"/>
        </div>
    </div>    
    `;
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  // console.log("Card values in matrix generator" + matrixGenerator);

  // cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        // flip the clicked card
        card.classList.add("flipped");
        console.log("firstCardValue"+firstCardValue);
        // firstcard initial value false
        if (!firstCard) {
         
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        }
      } else {
        console.log("going to execute moves counter")
        // movesCounter();
        console.log("secondCardValue"+secondCardValue);
        secondCard = card;
        let secondCardValue = card.getAttribute("data-card-value");
        if (firstCardValue == secondCardValue) {
          // if both cards are matched then it should remain open
          // and these cards are ignored in the next time

          firstCard.classList.add("matched");
          secondCard.classList.add("matched");

          firstCard = false;
          winCount += 1;
          // check if wincount ==half of the card value
          if (winCount == Math.floor(cardValues.length / 2)) {
            result.innerHTML = `<h2>You Won </h2>
              <h4>Moves:${movesCount}<h4> `;
            stopGame();
          }
        } else {
          // if the cards doesnot match, the cards should be back to normal
          let [tempFirst, tempSecond] = [firstCard, secondCard];
          firstCard = false;
          secondCard = false;
          let delay = setTimeout(() => {
            tempFirst.classList.remove("flipped");
            tempSecond.classList.remove("flipped");
          }, 900);
        }
      }
    });
  });
};

// start the game
startButton.addEventListener("click", () => {
  movesCount = 0;
  time = 0;
  // visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // start timer
  interval = setInterval(timeGenerator, 1000);
  // initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// initialize value and function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log("card values in the initializer fn" + cardValues);
  matrixGenerator(cardValues);
};

initializer();

// stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);
