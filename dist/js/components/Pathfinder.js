class Pathfinder {
  constructor(path) {
    const thisPathfinder = this;

    thisPathfinder.path = path;
  }

  getLineNeighboursInPath(square) {
    const thisPathfinder = this;

    const lineNeighbours = square.getLineNeighbours();
    return thisPathfinder.findEqualSquaresInArrays(thisPathfinder.path, lineNeighbours);
  }

  getCornerNeighboursInPath(square) {
    const thisPathfinder = this;

    const cornerNeighbours = square.getCornerNeighbours();
    return thisPathfinder.findEqualSquaresInArrays(thisPathfinder.path, cornerNeighbours);
  }

  getAllNeighboursInPath(square) {
    const thisPathfinder = this;
    
    return thisPathfinder.getLineNeighboursInPath(square).concat(thisPathfinder.getCornerNeighboursInPath(square));
  }

  findEqualSquaresInArrays(squaresArray1, squaresArray2) {
    const foundEquals = [];

    for (const square1 of squaresArray1) {
      for (const square2 of squaresArray2) {
        if (square1.isEqual(square2)) {
          foundEquals.push(square2);
        }
      }
    }

    return foundEquals;
  }

  isLineConnectionForAllSquares(pathToCheck) {
    const thisPathfinder = this;

    // no need to check a single square, it isn't connector between other squares
    if (pathToCheck.length <= 1) {
      return true;
    }

    // create copy of pathToCheck (in case of using it outside this method)
    const path = pathToCheck.slice();
    
    const connectedSquares = [];
    let allConnected = true;

    // move first square to connected squares path as connected
    thisPathfinder.moveSquare(path, connectedSquares, path[0]);

    // remove connected squares from path until exhaustion path array,
    while (path.length > 0) {
      const foundedConnectedSquare = thisPathfinder.findConnection(connectedSquares, path);
      if (!foundedConnectedSquare) {

        console.log('not found');
        allConnected = false;
        break;
      } else {
        thisPathfinder.moveSquare(path, connectedSquares, foundedConnectedSquare);
      }
    }

    return allConnected;
  }

  moveSquare(path, connectedSquares, square) {
    connectedSquares.push(square);
    path.splice(path.indexOf(square), 1);
  }

  findConnection(connectedSquares, path) {
    for (const connectedSquare of connectedSquares) {
      for (const square of path) {
        for (const neighbour of square.getLineNeighbours()) {
          if (connectedSquare.isEqual(neighbour)) {
            return square;
          }
        }
      }
    }
    return false;
  }
}

export default Pathfinder;