const cells = document.querySelectorAll('.cell');
let currentPlayer = "X";
let gameOver = false;
let isAgainstAI = true; // Default: AI mode

const winningPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
];

// Load saved scores from local storage
let xScore = localStorage.getItem("xScore") ? parseInt(localStorage.getItem("xScore")) : 0;
let oScore = localStorage.getItem("oScore") ? parseInt(localStorage.getItem("oScore")) : 0;
let drawScore = localStorage.getItem("drawScore") ? parseInt(localStorage.getItem("drawScore")) : 0;

// Update scores in the scoreboard
function updateScores() {
    document.getElementById("xScore").textContent = xScore;
    document.getElementById("oScore").textContent = oScore;
    document.getElementById("drawScore").textContent = drawScore;

    localStorage.setItem("xScore", xScore);
    localStorage.setItem("oScore", oScore);
    localStorage.setItem("drawScore", drawScore);
}

// Highlight the winning pattern
function highlightWinner(pattern) {
    pattern.forEach(index => {
        cells[index].style.backgroundColor = "#FFD700"; // Gold color for winners
        cells[index].style.transform = "scale(1.2)";
    });
}

// AI opponent logic
function aiMove() {
    if (gameOver) return;

    let emptyCells = [...cells].filter(cell => !cell.textContent);

    // AI tries to win first
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].textContent === "O" && cells[b].textContent === "O" && !cells[c].textContent) {
            cells[c].textContent = "O"; return setTimeout(checkWinner, 100);
        }
        if (cells[a].textContent === "O" && cells[c].textContent === "O" && !cells[b].textContent) {
            cells[b].textContent = "O"; return setTimeout(checkWinner, 100);
        }
        if (cells[b].textContent === "O" && cells[c].textContent === "O" && !cells[a].textContent) {
            cells[a].textContent = "O"; return setTimeout(checkWinner, 100);
        }
    }

    // Block opponent’s win
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].textContent === "X" && cells[b].textContent === "X" && !cells[c].textContent) {
            cells[c].textContent = "O"; return setTimeout(checkWinner, 100);
        }
        if (cells[a].textContent === "X" && cells[c].textContent === "X" && !cells[b].textContent) {
            cells[b].textContent = "O"; return setTimeout(checkWinner, 100);
        }
        if (cells[b].textContent === "X" && cells[c].textContent === "X" && !cells[a].textContent) {
            cells[a].textContent = "O"; return setTimeout(checkWinner, 100);
        }
    }

    // Take center if available
    if (!cells[4].textContent) {
        cells[4].textContent = "O";
        return setTimeout(checkWinner, 100);
    }

    // Choose random available spot
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    if (randomCell) randomCell.textContent = "O";

    setTimeout(checkWinner, 100);
}

// Handle player moves - **Fixed winning move visibility issue**
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (!cell.textContent && !gameOver) {
            cell.textContent = currentPlayer; // Place move **FIRST**
            
            setTimeout(() => {
                checkWinner(); // Delay the win check for better visibility
            }, 100); 

            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
            
            if (isAgainstAI && currentPlayer === "O") {
                setTimeout(() => { aiMove(); currentPlayer = "X"; }, 500);
            }
        }
    });
});

// Check for a winner or draw
function checkWinner() {
    if (gameOver) return;

    let isDraw = true;

    winningPatterns.forEach(pattern => {
        const [a, b, c] = pattern;
        if (cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent) {

            alert(`${cells[a].textContent} wins!`);
            highlightWinner(pattern);

            if (cells[a].textContent === "X") {
                xScore++;
            } else {
                oScore++;
            }

            updateScores();
            gameOver = true;
            setTimeout(resetBoard, 1500);
            isDraw = false;
            return;
        }
    });

    if (isDraw && [...cells].every(cell => cell.textContent)) {
        cells.forEach(cell => cell.style.backgroundColor = "#FFD700");
        alert("Match Draw!");
        drawScore++;
        updateScores();
        gameOver = true;
        setTimeout(resetBoard, 1500);
    }
}

// Reset the board for a new game
function resetBoard() {
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "#4CAF50";
        cell.style.transform = "scale(1)";
    });

    currentPlayer = "X";
}

document.getElementById("toggleMode").addEventListener("change", (event) => {
    isAgainstAI = event.target.checked;
    
    // Toggle visibility of mode labels
    document.getElementById("combatModeText").style.opacity = isAgainstAI ? "0.5" : "1";
    document.getElementById("aiModeText").style.opacity = isAgainstAI ? "1" : "0.5";

    resetBoard(); // Reset game when mode switches
});

// **Score Reset Button**
document.getElementById("resetScores").addEventListener("click", () => {
    localStorage.clear();
    xScore = 0;
    oScore = 0;
    drawScore = 0;
    updateScores();
});

// **Improved Code**
function checkForWin(player) {
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].textContent === player && cells[b].textContent === player && cells[c].textContent === player) {
            return true;
        }
    }
    return false;
}

function checkForDraw() {
    return [...cells].every(cell => cell.textContent);
}

function updateScore(player) {
    if (player === "X") {
        xScore++;
    } else {
        oScore++;
    }
    updateScores();
}

function endGame(player) {
    alert(`${player} wins!`);
    highlightWinner(winningPatterns.find(pattern => {
        const [a, b, c] = pattern;
        return cells[a].textContent === player && cells[b].textContent === player && cells[c].textContent === player;
    }));
    updateScore(player);
    gameOver = true;
    setTimeout(resetBoard, 1500);
}

function endGameDraw() {
    alert("Match Draw!");
    drawScore++;
    updateScores();
    gameOver = true;
    setTimeout(resetBoard, 1500);
}

// Check for a winner or draw
function checkWinner() {
    if (gameOver) return;

    if (checkForWin("X")) {
        endGame("X");
    } else if (checkForWin("O")) {
        endGame("O");
    } else if (checkForDraw()) {
        endGameDraw();
    }
}
function endGameDraw() {
    alert("Match Draw!");
    
    // 🎨 New Fix: Apply a flashing gold effect to all cells in a draw
    cells.forEach(cell => {
        cell.style.backgroundColor = "#FFD700";  // Gold highlight
        cell.style.transform = "scale(1.1)";  // Slight zoom effect
        cell.style.transition = "background-color 0.5s ease-in-out, transform 0.5s ease-in-out";
    });

    drawScore++;
    updateScores();
    gameOver = true;
    
    setTimeout(resetBoard, 1500);
}