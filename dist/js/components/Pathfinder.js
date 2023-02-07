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

  findShortestPath(startSquare, finishSquare) {
    const thisPathfinder = this;

    const variants = [];
    let foundShortestPath = [];

    variants[0] = [startSquare];
    

    do {
      const newVariants = [];
      
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        if (foundShortestPath.length > 0 && foundShortestPath.length <= variant.length) {
          variants.splice(i, 1);
          i--;
          continue;
        }

        const currentSquare = variant[variant.length - 1];
        const nextSquares = thisPathfinder.getLineNeighboursInPath(currentSquare);

        // found path between start and finish, no need to check other squares
        if (nextSquares.indexOf(finishSquare) > -1) {
          // replace current shortestPath when variant is shorter
          if (foundShortestPath.length > 0 && variant.length + 1 < foundShortestPath.length) {
            foundShortestPath = variant.slice().push(finishSquare);
          }
          variants.splice(i, 1);
          i--;
          continue;
        }

        const possibleNextSquares = [];

        for (let j = 0; j < nextSquares.length; j++) {
          const nextSquare = nextSquares[j];

          // continuation of path makes sense only with unique squares
          if (variant.indexOf(nextSquare) < 0) {
            possibleNextSquares.push(nextSquare);
          }
        }

        let isCurrentVariantContinuation = true;

        for (const possibleNextSquare of possibleNextSquares) {
          if (isCurrentVariantContinuation) {
            variant.push(possibleNextSquare);
            isCurrentVariantContinuation = false;
          } else {
            const newVariant = variant.slice();
            newVariant.splice(newVariant.length - 1, 1);
            newVariant.push(possibleNextSquare);
            newVariants.push(newVariant);
            //console.log('newVariant', newVariant);
            //newVariants.push(variant.slice().splice(variant.length - 1, 1).push(possibleNextSquare));
          }
        }

      }

      if (newVariants.length > 0) {
        for (const newVariant of newVariants) {
          variants.push(newVariant);
        }
      }
      console.log(variants);
    } while (variants.length > 0);
    


    
    

    //console.log('start neighbours', thisPathfinder.getLineNeighboursInPath(startSquare));
    //console.log('start', startSquare.x + ',' + startSquare.y);
    //console.log('finish', finishSquare.x + ',' + finishSquare.y);

    return foundShortestPath;
  }
}

export default Pathfinder;