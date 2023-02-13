class Finder {
  constructor(matrix) {
    const thisFinder = this;

    thisFinder.matrix = matrix;
    thisFinder.selectedSquares = thisFinder.getSelectedSquares();
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

    thisFinder.setAllSelectedSquaresUnvisited();
    thisFinder.dfs(thisFinder.selectedSquares[0]);

    let connected = true;

    for (const square of thisFinder.selectedSquares) {
      if (!square.visited) {
        connected = false;
        break;
      }
    }

    return connected;
  }

  dfs(square) {
    const thisFinder = this;

    square.visited = true;

    const neighbours = thisFinder.getSelectedNeighboursOfSquare(square);
    for (const neighbour of neighbours) {
      if (!neighbour.visited) {
        thisFinder.dfs(neighbour);
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
    thisFinder.setAllSelectedSquaresUnvisited();

    startSquare.way = 0;
    let queue = [startSquare];

    do {
      const currentSquare = queue.shift();
      currentSquare.visited = true;

      const neighbours = thisFinder.getSelectedNeighboursOfSquare(currentSquare);

      for (const neighbour of neighbours) {
        if (!neighbour.visited) {
          queue.push(neighbour);

          if (neighbour.way > currentSquare.way) {
            neighbour.way = currentSquare.way + 1;
            neighbour.parent = currentSquare;
          }
        }
      }
    } while (queue.length > 0);

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

    console.log(path);
    return path;
  }

  findLongestPath(startSquare, finishSquare) {
    const thisFinder = this;
    thisFinder.setAllSelectedSquaresUnvisited();
    thisFinder.path = [];
    thisFinder.longestPath = [];

    thisFinder.findPath(startSquare, finishSquare);

    return thisFinder.longestPath;
  }

  findPath(u, v) {
    const thisFinder = this;

    if (u.visited) {
      return;
    }

    u.visited = true;
    thisFinder.path.push(u);

    if (u == v) {
      if (thisFinder.path.length > thisFinder.longestPath.length) {
        thisFinder.longestPath = thisFinder.path.slice();
      }

      u.visited = false;
      thisFinder.path.splice(thisFinder.path.length - 1, 1);

      return;
    }

    const neighbours = thisFinder.getSelectedNeighboursOfSquare(u);

    for (const neighbour of neighbours) {
      this.findPath(neighbour, v);
    }

    u.visited = false;
    thisFinder.path.splice(thisFinder.path.length - 1, 1);
  }
}

export default Finder;