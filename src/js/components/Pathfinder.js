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
}



export default Pathfinder;