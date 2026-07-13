/* ===== GAME STATE ===== */
let isGameRunning = false;
let scoreBlue = 0;
let scoreRed = 0;
let gameInterval = null;
let currentStarter = "red";

const redScoreElem = document.querySelector(".redScore");
const blueScoreElem = document.querySelector(".blueScore");

const updateScores = () => {
    redScoreElem.innerHTML = scoreRed;
    blueScoreElem.innerHTML = scoreBlue;
};

/* ===== DIRECTIONS AND CONTROLS ===== */
const dir = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
};

const keyMap = {
    red: { up: "w", down: "s", left: "a", right: "d" },
    blue: { up: "i", down: "k", left: "j", right: "l" },
};

/* ===== PLAYER STATE ===== */
let redDir = dir.right;
let blueDir = dir.right;
const redPos = { x: 28, y: 1 };
const bluePos = { x: 30, y: 1 };

/* ===== CANVAS ===== */
const rows = 59;
const cols = 80;

let board = Array.from({ length: rows }, () => Array(cols).fill(0));

board[redPos.x][redPos.y] = 1;
board[bluePos.x][bluePos.y] = -1;

const canvas = document.querySelector(".canvas");

const resetBoard = () => {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    redPos.x = 28;
    redPos.y = 1;
    bluePos.x = 30;
    bluePos.y = 1;
    redDir = dir.right;
    blueDir = dir.right;
};

const renderBoard = () => {
    canvas.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
        const ul = document.createElement("ul");
        ul.classList.add("myUl");
        for (let j = 0; j < board[i].length; j++) {
            const li = document.createElement("li");
            li.classList.add("myLi");
            if (board[i][j] === 1) li.classList.add("red");
            if (board[i][j] === -1) li.classList.add("blue");
            ul.appendChild(li);
        }
        canvas.appendChild(ul);
    }
};

renderBoard();

/* ===== COLLISIONS ===== */
const checkBorder = (pos, direction) => {
    const newX = pos.x + direction.x;
    const newY = pos.y + direction.y;
    return newX < 0 || newX >= rows || newY < 0 || newY >= cols;
};

const checkTrail = (player) => {
    if (player === "red") {
        const nx = redPos.x + redDir.x;
        const ny = redPos.y + redDir.y;
        return board[nx][ny] !== 0;
    }
    if (player === "blue") {
        const nx = bluePos.x + blueDir.x;
        const ny = bluePos.y + blueDir.y;
        return board[nx][ny] !== 0;
    }
};

/* ===== PLAYER MOVEMENT ===== */
const move = (player) => {
    if (player === "red") {
        if (checkBorder(redPos, redDir) || checkTrail("red")) {
            scoreBlue++;
            updateScores();
            if (scoreBlue >= 3 || scoreRed >= 3) {
                clearInterval(gameInterval);
                isGameRunning = false;
                const winner = scoreBlue >= 3 ? "blue" : "red";
                window.location.href = `winner.html?winner=${winner}`;
                return true;
            }
            currentStarter = "blue";
            resetBoard();
            return true;
        }
        redPos.x += redDir.x;
        redPos.y += redDir.y;
        board[redPos.x][redPos.y] = 1;
        return false;
    }
    if (player === "blue") {
        if (checkBorder(bluePos, blueDir) || checkTrail("blue")) {
            scoreRed++;
            updateScores();
            if (scoreRed >= 3 || scoreBlue >= 3) {
                clearInterval(gameInterval);
                isGameRunning = false;
                const winner = scoreRed >= 3 ? "red" : "blue";
                window.location.href = `winner.html?winner=${winner}`;
                return true;
            }
            currentStarter = "red";
            resetBoard();
            return true;
        }
        bluePos.x += blueDir.x;
        bluePos.y += blueDir.y;
        board[bluePos.x][bluePos.y] = -1;
        return false;
    }
};

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ===== KEYBOARD INPUT ===== */
document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return;

    switch (e.key) {
        case keyMap.red.up:
            if (!isEqual(redDir, dir.down)) redDir = dir.up;
            break;
        case keyMap.red.down:
            if (!isEqual(redDir, dir.up)) redDir = dir.down;
            break;
        case keyMap.red.left:
            if (!isEqual(redDir, dir.right)) redDir = dir.left;
            break;
        case keyMap.red.right:
            if (!isEqual(redDir, dir.left)) redDir = dir.right;
            break;
        case keyMap.blue.up:
            if (!isEqual(blueDir, dir.down)) blueDir = dir.up;
            break;
        case keyMap.blue.down:
            if (!isEqual(blueDir, dir.up)) blueDir = dir.down;
            break;
        case keyMap.blue.left:
            if (!isEqual(blueDir, dir.right)) blueDir = dir.left;
            break;
        case keyMap.blue.right:
            if (!isEqual(blueDir, dir.left)) blueDir = dir.right;
            break;
        default:
            break;
    }
});

/* ===== START GAME ===== */
const startBtn = document.querySelector("#playBtn");
startBtn.addEventListener("click", () => {
    if (isGameRunning) return;
    isGameRunning = true;
    gameInterval = setInterval(() => {
        if (currentStarter === "red") {
            const ended = move("red");
            if (!ended) move("blue");
        } else {
            const ended = move("blue");
            if (!ended) move("red");
        }
        renderBoard();
    }, 100);
});

/* ===== CONTROLS PANEL ===== */
const ctrlBtn = document.getElementById("contorlsBtn");
const ctrlModal = document.querySelector(".controlModel");
const closeCtrl = document.getElementById("closeModel");

ctrlBtn.addEventListener("click", () => ctrlModal.classList.add("active"));
closeCtrl.addEventListener("click", () => ctrlModal.classList.remove("active"));

const redUp = document.getElementById("redUp");
const redDown = document.getElementById("redDown");
const redLeft = document.getElementById("redLeft");
const redRight = document.getElementById("redRight");

const blueUp = document.getElementById("blueUp");
const blueDown = document.getElementById("blueDown");
const blueLeft = document.getElementById("blueLeft");
const blueRight = document.getElementById("blueRight");

redUp.value = keyMap.red.up;
redDown.value = keyMap.red.down;
redLeft.value = keyMap.red.left;
redRight.value = keyMap.red.right;

blueUp.value = keyMap.blue.up;
blueDown.value = keyMap.blue.down;
blueLeft.value = keyMap.blue.left;
blueRight.value = keyMap.blue.right;

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("click", (e) => e.target.value = "");
    input.addEventListener("input", (e) => {
        const [player, dir] = e.target.id.split(/(?=[A-Z])/);
        keyMap[player][dir.toLowerCase()] = e.target.value;
    });
});