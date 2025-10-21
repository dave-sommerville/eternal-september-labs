'use strict';
import {Cell} from "./Cell.js";
import {Player} from "./Player.js";
import {Ship} from "./Ship.js";
import {select, selectAll, sleep, listen, addClass, removeClass, create} from "./utilities.js";

/*------------------------------------------------------------------------->
  Elements
<-------------------------------------------------------------------------*/
const startButton = select('.start-btn');
const gameGrid = select('.game-grid'); 
const displayGrid = select('.display-grid');
const startControls = select('.start-controls');
const shipMenu = select('.ship-menu');
const textDisplayOne = select('.descriptive-text');
const textDisplayTwo = select('.descriptive-text-two');
const resetButton = select('.reset-btn');

/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/
const gridSize = 10;
const allGameGridCells = {}; 
const allDisplayGridCells = {};

/*  -- Ships --  */
const carrier = new Ship("Carrier", "vertical", 5);
const battleship = new Ship("Battleship", "vertical", 4);
const cruiser = new Ship("Cruiser", "vertical", 3);
const submarine = new Ship("Submarine", "vertical", 3);
const destroyer = new Ship("Destroyer", "vertical", 2);
const shipsByName = { carrier, battleship, cruiser, submarine, destroyer };

/*  -- Selection Menu --  */
let placedShipCells = new Set();
let placedShipObjs = {};
let selectedShip = null;
let addedShips = [];

/*  -- Game States --  */
let user = null;
let computer = null;

/*  -- AI State -- */
let huntMode = true;          // true = random searching, false = targeting
let targetOrigin = null;      // first hit cell
let lastHit = null;           // most recent hit cell
let currentDirIndex = 0;      // index into cardinals
let triedDirs = new Set();
const cardinals = ['n', 'e', 's', 'w'];
const deltas = {
  n: [-1, 0],
  e: [0, 1],
  s: [1, 0],
  w: [0, -1]
};

createGameGrid();
createDisplayGrid();

/*------------------------------------------------------------------------->
  Listeners
<-------------------------------------------------------------------------*/
function resetGame() {
  placedShipCells = new Set();
  placedShipObjs = {};
  selectedShip = null;
  addedShips = [];
  user = null;
  computer = null;
  displayGrid.innerHTML = '';
  gameGrid.innerHTML = '';
  textDisplayOne.innerText = "";
  removeClass(startControls, 'hidden');
  addClass(resetButton, 'hidden');
  createGameGrid();
  createDisplayGrid();
  // Reset AI state
  huntMode = true;
  targetOrigin = null;
  lastHit = null;
  triedDirs.clear();
  currentDirIndex = 0;
}

listen('click', startButton, () => initializeGame());

listen('change', shipMenu, () => {
  const selectedName = select('input[name="ship-select"]:checked')?.value;
  if (selectedName && shipsByName[selectedName]) {
    selectedShip = shipsByName[selectedName];
    console.log("Selected Ship: ", selectedShip.name);
  } else {
    selectedShip = null;
    alert("No ship selected");
  }
});

listen('keydown', document, (e) => {
  if ((e.key === 'r' || e.key === 'R') && selectedShip) {
    selectedShip.orientation = 
      selectedShip.orientation === 'horizontal' ? 'vertical' : 'horizontal';
  }
});

listen('click', resetButton, resetGame);

/*------------------------------------------------------------------------->
  Functions
<-------------------------------------------------------------------------*/

function createGameGrid() {
  for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
      const div = create('div');
      addClass(div, 'grid-cell');
      div.dataset.row = row;
      div.dataset.col = col;

      const cell = new Cell(row, col, div);
      allGameGridCells[cell.key] = cell;

      gameGrid.appendChild(div);
      listen('click', div, () => {
        if (!user) {
          tryPlaceShip(row, col, selectedShip);
        } else {
          takeTurn(allGameGridCells[`${row},${col}`]);
        }
      });
    }
  }
}

function createDisplayGrid() {
  for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
      const div = create('div');
      addClass(div, 'grid-cell');
      div.dataset.row = row;
      div.dataset.col = col;

      const cell = new Cell(row, col, div);
      allDisplayGridCells[cell.key] = cell;

      displayGrid.appendChild(div);
    }
  }
}

/* ---- AI Helpers ---- */
function getNeighbor(cell, dir, allCells) {
  const [dr, dc] = deltas[dir];
  const row = cell.row + dr;
  const col = cell.col + dc;
  return allCells[`${row},${col}`] || null;
}

function attackUser(cellKey) {
  if (!cellKey) return false;
  const hit = user.attackResult(cellKey, textDisplayTwo);
  user.displayUserGrid(allDisplayGridCells);
  return hit;
}

/* ---- Computer Turn ---- */
function compTurn() {
  if (huntMode) {
    // random shot
    const target = user.getRandomUntriedCell(gridSize, allDisplayGridCells);
    if (!target) return;
    if (attackUser(target.key)) {
      huntMode = false;
      targetOrigin = target;
      lastHit = target;
      triedDirs.clear();
      currentDirIndex = 0;
    }
  } else {
    // target mode
    let dir = cardinals[currentDirIndex];

    while (triedDirs.has(dir) && triedDirs.size < 4) {
      currentDirIndex = (currentDirIndex + 1) % 4;
      dir = cardinals[currentDirIndex];
    }

    const nextCell = getNeighbor(lastHit, dir, allDisplayGridCells);
    if (!nextCell) {
      triedDirs.add(dir);
      currentDirIndex = (currentDirIndex + 1) % 4;
      compTurn(); // retry in another direction
      return;
    }

    const hit = attackUser(nextCell.key);
    if (hit) {
      lastHit = nextCell; // continue in this direction
    } else {
      triedDirs.add(dir);
      lastHit = targetOrigin; // reset back to origin
      currentDirIndex = (currentDirIndex + 1) % 4;

      if (triedDirs.size >= 4) {
        // no directions left → reset hunt mode
        huntMode = true;
        targetOrigin = null;
        lastHit = null;
      }
    }
  }
}

/* ---- Player Turn ---- */
function takeTurn(cell) {
  if (!user || !computer) return;

  // User attacks computer
  computer.attackResult(cell.key, textDisplayOne);
  computer.displayComputerGrid(allGameGridCells);

  checkEndCondition();
  if (computer.hasLost()) return;

  // Computer AI turn
  compTurn();
  checkEndCondition();
}

function checkEndCondition() {
  if(computer.hasLost() && user.hasLost()) {
    textDisplayOne.innerText = "It's a tie";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  } else if (computer.hasLost()) {
    textDisplayOne.innerText = "You win!";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  } else if (user.hasLost()) {
    textDisplayOne.innerText = "You lose!";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  }
}

function initializeGame() {
  removeClass(displayGrid, 'hidden');
  addClass(startControls, 'hidden');
  user = new Player("User", placedShipCells);
  computer = new Player('Computer', new Set());
  addClass(gameGrid, 'in-play');
  computer.randomlyPlaceShips(shipsByName, gridSize);
  computer.displayComputerGrid(allGameGridCells);
  user.displayUserGrid(allDisplayGridCells);
  selectedShip = null;
  addClass(resetButton, 'hidden');
}

function tryPlaceShip(startRow, startCol, shipChoice) {
  if (!shipChoice) {
    alert("You must choose a ship type.");
    return;
  }

  const shipName = shipChoice.name.toLowerCase();
  const positions = [];

  for (let i = 0; i < shipChoice.size; i++) {
    let row = startRow;
    let col = startCol;
    if (shipChoice.orientation === 'horizontal') col += i;
    if (shipChoice.orientation === 'vertical') row += i;

    const key = `${row},${col}`;
    if (row >= gridSize || col >= gridSize || placedShipCells.has(key)) {
      alert('Cannot place boat here!');
      return;
    }
    positions.push(key);
  }

  // Clear previous position for same ship
  if (placedShipObjs[shipName]) {
    placedShipObjs[shipName].forEach(key => {
      placedShipCells.delete(key);
      const cell = allGameGridCells[key];
      if (cell) cell.removeClass('occupied');
    });
  }

  // Add to grid
  positions.forEach((key) => {
    placedShipCells.add(key);
    const cell = allGameGridCells[key];
    if (cell) cell.addClass('occupied');
  });

  placedShipObjs[shipName] = positions;

  // Add ship name to addedShips if not already there
  if (!addedShips.includes(shipName)) {
    addedShips.push(shipName);
  }

  // Update ship menu visuals
  const shipRadios = document.querySelectorAll('input[name="ship-select"]');
  shipRadios.forEach(input => {
    const label = document.querySelector(`label[data-ship="${input.value}"]`);
    if (label && addedShips.includes(input.value)) {
      label.classList.add('placed');
    }
  });

  // Show start button if all ships placed
  if (Object.keys(placedShipObjs).length === Object.keys(shipsByName).length) {
    addClass(startButton, 'visible');
  } else {
    removeClass(startButton, 'visible');
  }
}
