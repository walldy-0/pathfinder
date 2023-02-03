import { classNames, settings } from '../settings.js';
import Pathfinder from './Pathfinder.js';
import Square from './Square.js';

class Grid {
  constructor(wrapper) {
    const thisGrid = this;

    // all squares of map
    thisGrid.map = [];

    // all selected squares
    thisGrid.path = [];
    
    thisGrid.start = false;
    thisGrid.end = false;

    thisGrid.initMap();
    thisGrid.render(wrapper);
    thisGrid.createMapElement();
    thisGrid.initActions();
  }

  initMap() {
    const thisGrid = this;

    for (let x = 0; x <= settings.pathfinder.maxX; x++) {
      thisGrid.map[x] = [];

      for (let y = 0; y <= settings.pathfinder.maxY; y++) {
        thisGrid.map[x][y] = new Square(x, y);
      }
    }
  }

  render(wrapper) {
    const thisGrid = this;

    thisGrid.dom = {};
    thisGrid.dom.wrapper = wrapper;
  }

  createMapElement() {
    const thisGrid = this;

    thisGrid.dom.table = document.createElement('table');
    thisGrid.dom.table.setAttribute('cellspacing', '0');
    thisGrid.dom.table.setAttribute('cellpadding', '0');

    for (let y = 0; y <= settings.pathfinder.maxY; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x <= settings.pathfinder.maxX; x++) {
        const cell = document.createElement('td');
        cell.innerHTML = x + '-' + y;

        cell.setAttribute('id', settings.pathfinder.cellIdPrefix + x + '-' + y);
        row.appendChild(cell);
      }

      thisGrid.dom.table.appendChild(row);
    }

    thisGrid.dom.wrapper.appendChild(thisGrid.dom.table);
  }

  initActions() {
    const thisGrid = this;

    thisGrid.dom.table.addEventListener('click', function(event) {
      if (event.target.tagName == 'TD') {
        const cell = event.target;
        const clickedSquare = thisGrid.getSquareFromTableCell(cell);

        if (clickedSquare.isSelected()) {
          if (thisGrid.canUnselectSquare(clickedSquare)) {
            clickedSquare.setSelected(false);
            thisGrid.path.splice(thisGrid.path.indexOf(clickedSquare), 1);
            cell.classList.remove(classNames.pathfinder.selected);
          }
        } else if (thisGrid.canSelectSquare(clickedSquare)) {
          clickedSquare.setSelected(true);
          thisGrid.path.push(clickedSquare);
          cell.classList.add(classNames.pathfinder.selected);
        }

        console.log('path', thisGrid.path);
      }
    });
  }

  getSquareFromTableCell(cell) {
    const thisGrid = this;

    const coords = cell.getAttribute('id').replace(settings.pathfinder.cellIdPrefix, '').split('-');
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    return thisGrid.map[x][y];
  }

  canSelectSquare(clickedSquare) {
    const thisGrid = this;

    // first square can be selected enywhere
    let canSelect = thisGrid.path.length == 0;

    if (!canSelect) {
      // every next square can be selected when has at least one neighbour in current path
      for (const square of thisGrid.path) {
        if (clickedSquare.isLineNeighbourOf(square)) {
          canSelect = true;
          break;
        }
      }
    }

    return canSelect;
  }

  canUnselectSquare(clickedSquare) {
    const thisGrid = this;

    const finder = new Pathfinder(thisGrid.path);

    // get all selected squares around clicked square
    //const pathToCheck = finder.getAllNeighboursInPath(clickedSquare);
    const pathToCheck = thisGrid.path.slice();
    pathToCheck.splice(pathToCheck.indexOf(clickedSquare), 1);
    console.log(thisGrid.path.length, pathToCheck.length);
    // check if unselection doesn't disrupt existing path
    const canUnselect = finder.isLineConnectionForAllSquares(pathToCheck);

    return canUnselect;
  }
}

export default Grid;