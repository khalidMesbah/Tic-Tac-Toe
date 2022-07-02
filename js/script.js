// class TicTacToe {

// }
/* variables */
let grid = document.getElementById(`grid`);
const playerXScore = document.getElementById(`player-x-score`);
const playerOScore = document.getElementById(`player-o-score`);
const result = document.getElementById(`result`);
let cells = [...document.querySelectorAll(`.cell`)];
let normalMode = document.getElementById(`win-by-3-consecutive`);
let playersScores = {
    "X": 0,
    "O": 0
};
let current = `O`;
let dimensionsElement = document.getElementById(`dimensions`);
let dimensions = 3;
let winCompos = [];
let compo = [];
/* functions */
const checkWin = (player) => {
    return winCompos.map(winCompo => {
        return winCompo.every(e => {
            return cells[e].children[1].getAttribute(`data-back`) === player;
        });
    }).includes(true);
};
const endByWin = (current) => {
    displayResult(`${current} Just Won The Game!!`);
    grid.style.pointerEvents = `none`;
    playersScores[current]++;
    new Audio(`../sounds/win.wav`).play();
};
const checkDie = () => {
    return cells.every(cell => cell.classList.contains(`active`));
};
const endByDie = () => {
    displayResult(`It's just a die!!`);
    grid.style.pointerEvents = `none`;
    new Audio(`../sounds/draw.wav`).play();
};
const getWinCompos = (dimensions) => {
    winCompos = [];
    /* horizontal compos*/
    for (let i = 0; i < dimensions ** 2; i += dimensions) {
        compo = [];
        for (let j = i; j < dimensions + i; j++)
            compo.push(j);
        winCompos.push(compo);
    }
    /* vertical compos */
    for (let i = 0; i < dimensions; i++) {
        compo = [];
        for (let j = i; j < dimensions ** 2; j += dimensions)
            compo.push(j);
        winCompos.push(compo);
    }
    /* main diagonal compo */
    compo = [];
    for (let i = 0; i < dimensions ** 2; i += dimensions + 1)
        compo.push(i);
    winCompos.push(compo);
    /* antidiagonal compo */
    compo = [];
    for (let i = 1; i <= dimensions; i++)
        compo.push((dimensions - 1) * i);
    winCompos.push(compo);
    return winCompos;
};
const getWinConsecutiveCompos = (dimensions) => {
    winCompos = [];
    /* horizontal compos*/
    for (let i = 0; i < dimensions ** 2; i += dimensions) {
        for (let j = i; j < dimensions + i; j++) {
            compo = [];
            for (let k = 0; k < 3; k++) {
                compo.push(j + k);
                if ((j + k) % dimensions === dimensions - 1) break;
            }
            if (compo.length === 3) winCompos.push(compo);
        }
    }
    /* vertical compos */
    for (let i = 0; i < dimensions; i++) {
        for (let j = i; j < dimensions ** 2; j += dimensions) {
            compo = [];
            for (let k = 0; k < 3 * dimensions; k += dimensions) {
                compo.push(j + k);
                if ((j + k + dimensions) >= dimensions ** 2) break;
            }
            if (compo.length === 3) winCompos.push(compo);
        }
    }
    /* main diagonal compo */
    for (let i = 0; i < dimensions ** 2; i += dimensions + 1) {
        compo = [];
        for (let j = 0; j < 3; j++) {
            compo.push(i + j * (dimensions + 1));
            if (i + j * (dimensions + 1) >= dimensions ** 2 - 1) break;
        }
        if (compo.length === 3) winCompos.push(compo);
    }
    /* antidiagonal compo */
    for (let i = dimensions - 1; i < dimensions ** 2; i += dimensions - 1) {
        compo = [];
        for (let j = 0; j < 3; j++) {
            compo.push(i + j * (dimensions - 1));
            if (i + j * (dimensions - 1) >= dimensions ** 2 - dimensions - 1) break;
        }
        if (compo.length === 3) winCompos.push(compo);
    }
    return winCompos;
};
const displayResult = (message) => {
    result.textContent = message;
};
const resetTheResult = () => {
    result.textContent = `waiting...`;
};
const updateScores = () => {
    playerXScore.textContent = playersScores.X;
    playerOScore.textContent = playersScores.O;
};
const restart = () => {
    resetTheResult();
    grid.style.pointerEvents = `auto`;
    cells.map(cell => {
        if (cell.classList.contains(`active`)) {
            cell.classList.remove(`active`);
            cell.children[1].removeAttribute(`data-back`);
        }
    });
    renderTheGrid(dimensions);
};
const reset = () => {
    resetTheResult();
    restart();
    playersScores.X = 0;
    playersScores.O = 0;
    updateScores();
    renderTheGrid(dimensions);
};
const activate = () => {
    cells.map(cell => cell.addEventListener(`click`, () => {
        if (!cell.classList.contains(`active`)) {
            current === `O` ? current = `X` : current = `O`;
            cell.children[1].setAttribute(`data-back`, current);
            cell.classList.add(`active`);
        }
        if (checkWin(current)) {
            endByWin(current);
            updateScores();
        } else if (checkDie()) {
            endByDie();
        }
    }));
};
const renderTheGrid = () => {
    dimensions = +dimensionsElement.value || dimensions;
    if (dimensions > 15) dimensions = 15;
    else if (dimensions <= 0) dimensions = 3;
    if (normalMode.checked) {
        winCompos = getWinConsecutiveCompos(dimensions);
    } else {
        winCompos = getWinCompos(dimensions);
    }
    grid.innerHTML = `
    <div class="cell">
    <div class="face front"></div>
    <div class="face back"></div>
    </div>`.repeat(dimensions ** 2);
    grid.style.cssText = `
    grid-template-columns: repeat(${dimensions}, calc(${50 * dimensions}px / ${dimensions}));
    grid-template-rows: repeat(${dimensions}, calc(${50 * dimensions}px / ${dimensions}));
    width: ${50 * dimensions}px;
    height: ${50 * dimensions}px;
    `;
    cells = [...document.querySelectorAll(`.cell`)];
    activate();
};

// first rendering
renderTheGrid();

// the buttons
const restartBtn = document.getElementById(`restart`);
restartBtn.addEventListener(`click`, restart);
const resetBtn = document.getElementById(`reset`);
resetBtn.addEventListener(`click`, reset);