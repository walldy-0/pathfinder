import { settings } from '../settings.js';

class Finder {
  constructor(matrix) {
    const thisFinder = this;

    thisFinder.matrix = matrix;
    thisFinder.selectedSquares = thisFinder.getSelectedSquares();

    thisFinder.shortestPath = undefined;
    thisFinder.longestPath = undefined;
    thisFinder.abortExecution = false;
  }

  getSelectedSquares() {
    const thisFinder = this;

    const selectedSquares = [];

    for (const col of thisFinder.matrix) {
      for (const square of col) {
        if (square.selected) {
          selectedSquares.push(square);
        }
      }
    }

    return selectedSquares;
  }

  checkAllSquaresConnected() {
    const thisFinder = this;

    if (thisFinder.selectedSquares.length <= 1) {
      return true;
    }

    thisFinder.setAllSelectedSquaresUnvisited();
    thisFinder.checkConnections(thisFinder.selectedSquares[0]);

    let connected = true;

    for (const square of thisFinder.selectedSquares) {
      if (!square.visited) {
        connected = false;
        break;
      }
    }

    return connected;
  }

  checkConnections(square) {
    const thisFinder = this;

    square.visited = true;

    const neighbours = thisFinder.getSelectedNeighboursOfSquare(square);
    for (const neighbour of neighbours) {
      if (!neighbour.visited) {
        thisFinder.checkConnections(neighbour);
      }
    }
  }

  getSelectedNeighboursOfSquare(square) {
    const thisFinder = this;

    const selectedNeighbours = [];
    const potentialNeighbours = square.getLineNeighbours();

    for (const neighbour of potentialNeighbours) {
      const matrixNeighbour = thisFinder.matrix[neighbour.x][neighbour.y];
      if (matrixNeighbour.selected) {
        selectedNeighbours.push(matrixNeighbour);
      }
    }

    return selectedNeighbours;
  }

  setAllSelectedSquaresUnvisited() {
    const thisFinder = this;

    for (const square of thisFinder.selectedSquares) {
      square.visited = false;
    }
  }

  findShortestPath(startSquare, finishSquare) {
    const thisFinder = this;

    thisFinder.startTime = Date.now();
    thisFinder.abortExecution = false;
    thisFinder.findShortest(startSquare, finishSquare);
  }

  findShortest(startSquare, finishSquare) {
    const thisFinder = this;
    thisFinder.setAllSelectedSquaresUnvisited();

    startSquare.distance = 0;
    let queue = [startSquare];

    do {
      const currentSquare = queue.shift();
      currentSquare.visited = true;

      const neighbours = thisFinder.getSelectedNeighboursOfSquare(currentSquare);

      for (const neighbour of neighbours) {
        if (!neighbour.visited) {
          queue.push(neighbour);

          if (neighbour.distance > currentSquare.distance) {
            neighbour.distance = currentSquare.distance + 1;
            neighbour.parent = currentSquare;
          }
        }
      }

      thisFinder.abortExecution = Date.now() - thisFinder.startTime > settings.pathfinder.maxSearchExecutionTime; 

    } while (queue.length > 0 && !thisFinder.abortExecution);

    //console.log('executionTime', Date.now() - thisFinder.startTime);

    if (!thisFinder.abortExecution) {
      const pathInverted = [finishSquare];
      let hasParent = finishSquare.parent != undefined;

      while (hasParent) {
        const parent = pathInverted[pathInverted.length -1].parent;
        hasParent = parent != undefined;

        if (hasParent) {
          pathInverted.push(parent);
        }
      }

      const path = [];
      for (let i = pathInverted.length - 1; i >= 0; i--) {
        path.push(pathInverted[i]);
      }

      thisFinder.shortestPath = path;
    }

    
    /*
    const path = [];
    for (let i = pathInverted.length - 1; i >= 0; i--) {
      path.push(pathInverted[i]);
    }

    return path;*/
  }

  findLongestPath(startSquare, finishSquare) {
    const thisFinder = this;
    thisFinder.setAllSelectedSquaresUnvisited();
    thisFinder.path = [];

    thisFinder.startTime = Date.now();
    thisFinder.abortExecution = false;
    thisFinder.longestPath = [];
    
    thisFinder.findPath(startSquare, finishSquare);

    if (thisFinder.abortExecution) {
      thisFinder.longestPath = undefined;
    }

    //return thisFinder.longestPath;
  }

  findPath(startSquare, finishSquare) {
    const thisFinder = this;

    thisFinder.abortExecution = Date.now() - thisFinder.startTime > settings.pathfinder.maxSearchExecutionTime;

    if (!startSquare.visited && !thisFinder.abortExecution) {

      startSquare.visited = true;
      thisFinder.path.push(startSquare);

      if (startSquare == finishSquare) {
        if (thisFinder.path.length > thisFinder.longestPath.length) {
          thisFinder.longestPath = thisFinder.path.slice();
        }

        startSquare.visited = false;
        thisFinder.path.splice(thisFinder.path.length - 1, 1);

        return;
      }

      const neighbours = thisFinder.getSelectedNeighboursOfSquare(startSquare);

      for (const neighbour of neighbours) {
        thisFinder.findPath(neighbour, finishSquare);
      }

      startSquare.visited = false;
      thisFinder.path.splice(thisFinder.path.length - 1, 1);
    }
  }
}

export default Finder;