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

    // remove connected squares from path until exhaustion of path array
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

  findShortestPath(startSquare, finishSquare) {
    const thisPathfinder = this;

    // array of Squares from start to end in steps order (return value)
    let foundShortestPath = [];

    // every potential variant of path between start and finish square
    let variants = [];

    // initiation of first variant - it must be startSquare
    variants[0] = [startSquare];
    
    do {
      // every incremented version of existing variants[]
      const newVariants = [];
      
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        // TODO move this code below?
        if (foundShortestPath.length > 0 && foundShortestPath.length <= variant.length) {
          variants.splice(i, 1);
          i--;
          continue;
        }
        

        // last Square of current path variant
        const currentSquare = variant[variant.length - 1];

        // every possible next step in selected path
        const nextSquares = thisPathfinder.getLineNeighboursInPath(currentSquare);

        // found path between start and finish
        if (nextSquares.indexOf(finishSquare) > -1) {
          const foundPath = variant.slice();
          foundPath.push(finishSquare);
          
          if (foundShortestPath.length > 0) {
            if (foundPath.length < foundShortestPath.length) {
              foundShortestPath = foundPath;
            }
          } else {
            foundShortestPath = foundPath;
          }
          
          //no need to check other squares - shortest way already found for this variant
          variants.splice(i, 1);
          i--;
          continue;
        }

        for (const nextSquare of nextSquares) {
          // continuation of path makes sense only with unique squares
          if (variant.indexOf(nextSquare) < 0) {
            const newVariant = variant.slice();
            newVariant.push(nextSquare);
            newVariants.push(newVariant);
          }
        }
      }

      // new version of variants[]
      variants = newVariants.slice();

    // variants possibilities exhausted
    } while (variants.length > 0);

    return foundShortestPath;
  }
}

export default Pathfinder;