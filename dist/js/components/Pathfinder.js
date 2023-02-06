class Pathfinder {
  constructor(path) {
    const thisPathfinder = this;

    thisPathfinder.path = path;
  }

  getLineNeighboursInPath(square) {
    const thisPathfinder = this;

    const lineNeighbours = square.getLineNeighbours();
    return thisPathfinder.findSquaresInPath(lineNeighbours);
  }

  getCornerNeighboursInPath(square) {
    const thisPathfinder = this;

    const cornerNeighbours = square.getCornerNeighbours();
    return thisPathfinder.findSquaresInPath(cornerNeighbours);
  }

  getAllNeighboursInPath(square) {
    const thisPathfinder = this;
    
    return thisPathfinder.getLineNeighboursInPath(square).concat(thisPathfinder.getCornerNeighboursInPath(square));
  }

  findSquaresInPath(squares) {
    const thisPathfinder = this;

    const foundEquals = [];

    for (const pathSquare of thisPathfinder.path) {
      for (const square of squares) {
        if (pathSquare.isEqual(square)) {
          foundEquals.push(pathSquare);
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
    
    const connectedSquares = [];
    let allConnected = true;

    // move first square to connected squares path as connected
    thisPathfinder.moveSquare(pathToCheck, connectedSquares, pathToCheck[0]);

    // remove connected squares from path until exhaustion path array,
    while (pathToCheck.length > 0) {
      const foundConnectedSquare = thisPathfinder.findConnection(connectedSquares, pathToCheck);
      if (!foundConnectedSquare) {
        allConnected = false;
        break;
      } else {
        thisPathfinder.moveSquare(pathToCheck, connectedSquares, foundConnectedSquare);
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

  //findShortestPath(startSquare, finishSquare) {
  //const thisPathfinder = this;


  //console.log('start neighbours', thisPathfinder.getLineNeighboursInPath(startSquare));
  //console.log('start', startSquare.x + ',' + startSquare.y);
  //console.log('finish', finishSquare.x + ',' + finishSquare.y);
  //}
}

export default Pathfinder;