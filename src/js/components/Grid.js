import { classNames, settings, select, strings } from '../settings.js';
import Pathfinder from './Pathfinder.js';
import Square from './Square.js';

class Grid {
  constructor(wrapper) {
    const thisGrid = this;

    // all squares of map
    thisGrid.map = [];

    // all selected squares
    thisGrid.path = [];

    thisGrid.modes = {
      drawing: 1,
      markStartStop: 2,
      compute: 3,
    };
    
    thisGrid.startSquare = false;
    thisGrid.finishSquare = false;

    thisGrid.initMap();
    thisGrid.render(wrapper);
    thisGrid.createMapElement();
    thisGrid.initActions();

    thisGrid.currentMode = thisGrid.modes.drawing;
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
    thisGrid.dom.button = wrapper.querySelector(select.pathfinder.button);
    thisGrid.dom.button.innerHTML = strings.pathfinder.buttons.finishDrawing;
    thisGrid.dom.message = wrapper.querySelector(select.pathfinder.message);
    thisGrid.dom.message.innerHTML = strings.pathfinder.messages.drawRoutes;
    thisGrid.dom.error = wrapper.querySelector(select.pathfinder.error);
    thisGrid.dom.error.innerHTML = '';
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

        if (thisGrid.currentMode == thisGrid.modes.drawing) {
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
        } else if (thisGrid.currentMode == thisGrid.modes.markStartStop) {
          if (clickedSquare.isSelected()) {
            if (clickedSquare.isEqual(thisGrid.startSquare)) {
              thisGrid.startSquare = false;
              cell.classList.remove(classNames.pathfinder.start);
              cell.innerHTML = clickedSquare.x + '-' + clickedSquare.y;
            } else if (clickedSquare.isEqual(thisGrid.finishSquare)) {
              thisGrid.finishSquare = false;
              cell.classList.remove(classNames.pathfinder.finish);
              cell.innerHTML = clickedSquare.x + '-' + clickedSquare.y;
            } else if (!thisGrid.startSquare) {
              thisGrid.startSquare = new Square(clickedSquare.x, clickedSquare.y);
              cell.classList.add(classNames.pathfinder.start);
              cell.innerHTML = 'S';
            } else if (!thisGrid.finishSquare) {
              thisGrid.finishSquare = new Square(clickedSquare.x, clickedSquare.y);
              cell.classList.add(classNames.pathfinder.finish);
              cell.innerHTML = 'F';
            }
          }
        }
      }
    });

    thisGrid.dom.button.addEventListener('click', function(event) {
      event.preventDefault();

      switch (thisGrid.currentMode) {
      
      case thisGrid.modes.drawing:
        thisGrid.currentMode = thisGrid.modes.markStartStop;
        thisGrid.dom.button.innerHTML = strings.pathfinder.buttons.compute;
        thisGrid.dom.message.innerHTML = strings.pathfinder.messages.markStartFinish;
        break;

      case thisGrid.modes.markStartStop:
        if (thisGrid.startSquare && thisGrid.finishSquare) {
          /*const finder = new Pathfinder(thisGrid.path);
          const shortestPath = finder.findShortestPath(
            thisGrid.map[thisGrid.startSquare.x][thisGrid.startSquare.y],
            thisGrid.map[thisGrid.finishSquare.x][thisGrid.finishSquare.y]
          );*/

          thisGrid.currentMode = thisGrid.modes.compute;
          thisGrid.dom.button.innerHTML = strings.pathfinder.buttons.startAgain;
          thisGrid.dom.message.innerHTML = strings.pathfinder.messages.result;
        }
        
        break;

      case thisGrid.modes.compute:
        
        thisGrid.currentMode = thisGrid.modes.drawing;
        thisGrid.dom.button.innerHTML = strings.pathfinder.buttons.compute;
        thisGrid.dom.message.innerHTML = strings.pathfinder.messages.drawRoutes;
        break;

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

    // get all selected squares excluding currently clicked
    const pathToCheck = thisGrid.path.slice();
    pathToCheck.splice(pathToCheck.indexOf(clickedSquare), 1);
    
    // check if unselection doesn't disrupt existing path
    const canUnselect = finder.isLineConnectionForAllSquares(pathToCheck);

    return canUnselect;
  }
}

export default Grid;