import { settings } from '../settings.js';

class Square {
  constructor(x, y) {
    const thisSquare = this;

    thisSquare.x = x;
    thisSquare.y = y;
    thisSquare.selected = false;

    // searching connections between other squares variables
    thisSquare.visited = false;
    thisSquare.parent = undefined;
    thisSquare.distance = Number.MAX_SAFE_INTEGER;
  }

  isLineNeighbourOf(otherSquare) {
    const thisSquare = this;

    let result = false;

    // otherSquare is neighbour of current, when has the same x or y with distance=1
    if (thisSquare.x == otherSquare.x) {
      result = Math.abs(thisSquare.y - otherSquare.y) == 1;
    } else if (thisSquare.y == otherSquare.y) {
      result = Math.abs(thisSquare.x - otherSquare.x) == 1;
    }

    return result;
  }

  getLineNeighbours() {
    const thisSquare = this;

    const neighbours = [];

    // north neighbour
    const northY = thisSquare.y - 1;
    if (northY >= 0) {
      neighbours.push(new Square(thisSquare.x, northY));
    }

    // east neighbour
    const eastX = thisSquare.x + 1;
    if (eastX <= settings.pathfinder.maxX) {
      neighbours.push(new Square(eastX, thisSquare.y));
    }

    // south neighbour
    const southY = thisSquare.y + 1;
    if (southY <= settings.pathfinder.maxY) {
      neighbours.push(new Square(thisSquare.x, southY));
    }

    // west neighbour
    const westX = thisSquare.x - 1;
    if (westX >= 0) {
      neighbours.push(new Square(westX, thisSquare.y));
    }

    return neighbours;
  }

  getCornerNeighbours() {
    const thisSquare = this;

    const neighbours = [];

    // north-east neighbour
    const neX = thisSquare.x + 1;
    const neY = thisSquare.y - 1;
    if (neX <= settings.pathfinder.maxX && neY >= 0) {
      neighbours.push(new Square(neX, neY));
    }

    // south-east neighbour
    const seX = thisSquare.x + 1;
    const seY = thisSquare.y + 1;
    if (seX <= settings.pathfinder.maxX && seY <= settings.pathfinder.maxY) {
      neighbours.push(new Square(seX, seY));
    }

    // south-west neighbour
    const swX = thisSquare.x - 1;
    const swY = thisSquare.y + 1;
    if (swX >= 0 && swY <= settings.pathfinder.maxY) {
      neighbours.push(new Square(swX, swY));
    }

    // north-west neighbour
    const nwX = thisSquare.x - 1;
    const nwY = thisSquare.y - 1;
    if (nwX >= 0 && nwY >= 0) {
      neighbours.push(new Square(nwX, nwY));
    }

    return neighbours;
  }

  isEqual(otherSquare) {
    const thisSquare = this;

    return thisSquare.x == otherSquare.x && thisSquare.y == otherSquare.y;
  }
}

export default Square;