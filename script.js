
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const newTestButton = document.getElementById("new-test");

userInput.addEventListener("input", handleInput);

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;


const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML += arr.join("");
};


function handleInput() {
    let quoteChars = Array.from(document.querySelectorAll(".quote-chars"));
    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        handleCharacter(char, userInputChars[index]);
        updateMistakes(char);
    });

    checkSuccess(quoteChars);
}


function handleCharacter(char, userInputChar) {
    if (char.innerText === userInputChar) {
        char.classList.add("success");
    } else if (userInputChar == null) {
        removeClasses(char, ["success", "fail"]);
    } else {
        handleMistake(char);
    }
}


function removeClasses(element, classes) {
    classes.forEach((className) => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    });
}


function handleMistake(char) {
    if (!char.classList.contains("fail")) {
        mistakes++;
        char.classList.add("fail");
        document.getElementById("mistakes").innerText = mistakes;
    }
}


function updateMistakes(char) {
    if (char.innerText === "X") {
        mistakes += 2;
        document.getElementById("mistakes").innerText = mistakes;
    }
}


function checkSuccess(quoteChars) {
    let check = quoteChars.every((element) => {
        return element.classList.contains("success");
    });
    if (check) {
        displayResult();
    }
}


function updateTimer() {
    if (time == 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}


const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};


const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
    newTestButton.style.display = "block";
};


const newTest = () => {
    location.reload();
};


const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};


window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    newTestButton.style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}

