function seed() {
  return [...arguments]
}

function same([x, y], [j, k]) {
  return (x === j && y === k)
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(c => same(c, cell));
}

const printCell = (cell, state) => {
    return (contains.call(state,cell) ? '\u25A3' : '\u25A2')
};

const corners = (state = []) => {

  if (!state.length) {
    return {topRight: [0,0], bottomLeft: [0,0]}
  }

  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);
  return {
    topRight: [Math.max(...xs), Math.max(...ys)],
    bottomLeft: [Math.min(...xs), Math.min(...ys)]
  }
};

const printCells = (state) => {

  const cornersObject = corners(state);
  let cellString = ""

  for (let y = cornersObject.topRight[1]; y >= cornersObject.bottomLeft[1]; y--) {
    for (let x = cornersObject.bottomLeft[0]; x <= cornersObject.topRight[0]; x++) {

      cellString += printCell([x, y], state) + " "
    }

    cellString += "\n"
  }
  return cellString
};

const getNeighborsOf = ([x, y]) => {
  //returns all neighbours sorrounding a cell
  return [[x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y], [x+1, y], [x-1, y+1], [x, y+1], [x+1, y+1]]  
};

const getLivingNeighbors = (cell, state) => {

  let neighbours = getNeighborsOf(cell);
  let livingneighbours = []

  for (let arr of neighbours){
    if (contains.call(state, arr)) {
      livingneighbours.push(arr)
    }

  }
  return livingneighbours;
};

const willBeAlive = (cell, state) => {

  let livingNeighbours = getLivingNeighbors(cell, state);
  let isAlive = contains.call(state, cell);

  if (livingNeighbours.length === 3 || (livingNeighbours.length === 2 && isAlive === true)) {
    return true;
  } else {
    return false;
  }
};

const calculateNext = (state) => {
  let cornersObject = corners(state);
  let newState  = [];

  for (let i = cornersObject.topRight[0] + 1; i >= cornersObject.bottomLeft[0] - 1; i--) {
    for (let j = cornersObject.bottomLeft[1] - 1; j <= cornersObject.topRight[1] + 1; j++) {
      if (willBeAlive([i, j], state) === true) {
        newState.push([i, j])
      }
    }
  }
  return newState
};

const iterate = (state, iterations) => {
  let gameStates = [state];
  let currentState = state;

  for (let i = 0; i < iterations; i++) {
    newState = (calculateNext(currentState));
    gameStates.push(newState);
    currentState = newState;
  }
  return gameStates;
};

function main(pattern, iterations) {

  const allStates = iterate(startPatterns[pattern], iterations);
  allStates.forEach(element => console.log(printCells(element)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;