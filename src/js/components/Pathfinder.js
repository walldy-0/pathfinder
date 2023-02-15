import { classNames, settings, select, strings } from '../settings.js';
import Finder from './Finder.js';
import Square from './Square.js';

class Pathfinder {
  constructor(wrapper) {
    const thisPathfinder = this;

    thisPathfinder.modes = {
      drawing: 1,
      markStartStop: 2,
      compute: 3,
    };
    
    thisPathfinder.currentMode = thisPathfinder.modes.drawing;
    thisPathfinder.startSquare = false;
    thisPathfinder.finishSquare = false;
    thisPathfinder.initMatrix();
    thisPathfinder.render(wrapper);
    thisPathfinder.createGridElement();
    thisPathfinder.initActions();
  }

  initMatrix() {
    const thisPathfinder = this;

    // matrix of Squares
    thisPathfinder.matrix = [];

    for (let x = 0; x <= settings.pathfinder.maxX; x++) {
      thisPathfinder.matrix[x] = [];

      for (let y = 0; y <= settings.pathfinder.maxY; y++) {
        thisPathfinder.matrix[x][y] = new Square(x, y);
      }
    }
  }

  render(wrapper) {
    const thisPathfinder = this;

    thisPathfinder.dom = {};
    thisPathfinder.dom.wrapper = wrapper;
    thisPathfinder.dom.button = wrapper.querySelector(select.pathfinder.button);
    thisPathfinder.dom.button.innerHTML = strings.pathfinder.buttons.finishDrawing;
    thisPathfinder.dom.message = wrapper.querySelector(select.pathfinder.message);
    thisPathfinder.dom.message.innerHTML = strings.pathfinder.messages.drawRoutes;
    thisPathfinder.dom.error = wrapper.querySelector(select.pathfinder.error);
    thisPathfinder.dom.error.innerHTML = '&nbsp;';
    thisPathfinder.dom.gridWrapper = wrapper.querySelector(select.pathfinder.gridWrapper);
    thisPathfinder.dom.modal = document.querySelector(select.modal.container);
    thisPathfinder.dom.modalCloseButton = document.querySelector(select.modal.modalCloseButton);
    thisPathfinder.dom.routeFull = document.querySelector(select.modal.routeFull);
    thisPathfinder.dom.routeLongest = document.querySelector(select.modal.routeLongest);
    thisPathfinder.dom.routeShortest = document.querySelector(select.modal.routeShortest);
  }

  createGridElement() {
    const thisPathfinder = this;

    thisPathfinder.dom.table = document.createElement('table');
    thisPathfinder.dom.table.setAttribute('cellspacing', '0');
    thisPathfinder.dom.table.setAttribute('cellpadding', '0');

    for (let y = 0; y <= settings.pathfinder.maxY; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x <= settings.pathfinder.maxX; x++) {
        const cell = document.createElement('td');

        cell.setAttribute('id', settings.pathfinder.cellIdPrefix + x + '-' + y);
        row.appendChild(cell);
      }

      thisPathfinder.dom.table.appendChild(row);
    }

    thisPathfinder.dom.gridWrapper.appendChild(thisPathfinder.dom.table);
  }

  initActions() {
    const thisPathfinder = this;

    // grid actions
    thisPathfinder.dom.table.addEventListener('click', function(event) {
      if (event.target.tagName == 'TD') {
        const cell = event.target;
        const clickedSquare = thisPathfinder.getSquareFromTableCell(cell);

        thisPathfinder.dom.error.innerHTML = '&nbsp;';

        if (thisPathfinder.currentMode == thisPathfinder.modes.drawing) {
          if (clickedSquare.selected) {
            if (thisPathfinder.canUnselectSquare(clickedSquare)) {
              clickedSquare.selected = false;
              cell.classList.remove(classNames.pathfinder.selected);
              thisPathfinder.setHints();
            }
          } else if (thisPathfinder.canSelectSquare(clickedSquare)) {
            clickedSquare.selected = true;
            cell.classList.add(classNames.pathfinder.selected);
            thisPathfinder.setHints();
          }
        } else if (thisPathfinder.currentMode == thisPathfinder.modes.markStartStop) {
          if (clickedSquare.selected) {
            if (clickedSquare.isEqual(thisPathfinder.startSquare)) {
              thisPathfinder.startSquare = false;
              cell.classList.remove(classNames.pathfinder.start);
              cell.innerHTML = '';
            } else if (clickedSquare.isEqual(thisPathfinder.finishSquare)) {
              thisPathfinder.finishSquare = false;
              cell.classList.remove(classNames.pathfinder.finish);
              cell.innerHTML = '';
            } else if (!thisPathfinder.startSquare) {
              thisPathfinder.startSquare = new Square(clickedSquare.x, clickedSquare.y);
              cell.classList.add(classNames.pathfinder.start);
              cell.innerHTML = strings.pathfinder.text.startSquare;
            } else if (!thisPathfinder.finishSquare) {
              thisPathfinder.finishSquare = new Square(clickedSquare.x, clickedSquare.y);
              cell.classList.add(classNames.pathfinder.finish);
              cell.innerHTML = strings.pathfinder.text.finishSquare;
            }
          }
        }
      }
    });

    // button actions
    thisPathfinder.dom.button.addEventListener('click', function(event) {
      event.preventDefault();

      thisPathfinder.dom.error.innerHTML = '&nbsp;';
      const finder = new Finder(thisPathfinder.matrix);

      switch (thisPathfinder.currentMode) {
      
      case thisPathfinder.modes.drawing:
        if (finder.selectedSquares.length >= 2) {
          thisPathfinder.currentMode = thisPathfinder.modes.markStartStop;
          thisPathfinder.dom.button.innerHTML = strings.pathfinder.buttons.compute;
          thisPathfinder.dom.message.innerHTML = strings.pathfinder.messages.markStartFinish;
          thisPathfinder.removeHints();
        } else {
          thisPathfinder.dom.error.innerHTML = strings.pathfinder.errors.selectTwoSquares;
        }
        break;

      case thisPathfinder.modes.markStartStop:
        if (thisPathfinder.startSquare && thisPathfinder.finishSquare) {
          finder.findShortestPath(
            thisPathfinder.matrix[thisPathfinder.startSquare.x][thisPathfinder.startSquare.y],
            thisPathfinder.matrix[thisPathfinder.finishSquare.x][thisPathfinder.finishSquare.y]
          );

          finder.findLongestPath(
            thisPathfinder.matrix[thisPathfinder.startSquare.x][thisPathfinder.startSquare.y],
            thisPathfinder.matrix[thisPathfinder.finishSquare.x][thisPathfinder.finishSquare.y]
          );
          
          if (finder.shortestPath != undefined) {
            for (const square of finder.shortestPath) {
              const cell = document.getElementById(settings.pathfinder.cellIdPrefix + square.x + '-' + square.y);
              
              cell.setAttribute('class', classNames.pathfinder.markedPath);
            }
          }
          
          thisPathfinder.currentMode = thisPathfinder.modes.compute;
          thisPathfinder.dom.button.innerHTML = strings.pathfinder.buttons.startAgain;
          thisPathfinder.dom.message.innerHTML = strings.pathfinder.messages.result;
          thisPathfinder.dom.routeFull.innerHTML = finder.selectedSquares.length;
          thisPathfinder.dom.routeLongest.innerHTML = finder.longestPath != undefined ? finder.longestPath.length - 1 : 'unknown';
          thisPathfinder.dom.routeShortest.innerHTML = finder.shortestPath != undefined ? finder.shortestPath.length - 1 : 'unknown';
          thisPathfinder.dom.modal.classList.add(classNames.pathfinder.modal.active);

        } else {
          thisPathfinder.dom.error.innerHTML = strings.pathfinder.errors.markStartFinish;
        }
        
        break;

      case thisPathfinder.modes.compute:
        thisPathfinder.resetGrid();
        thisPathfinder.currentMode = thisPathfinder.modes.drawing;
        thisPathfinder.dom.button.innerHTML = strings.pathfinder.buttons.finishDrawing;
        thisPathfinder.dom.message.innerHTML = strings.pathfinder.messages.drawRoutes;
        break;
      }
    });

    // modal actions
    thisPathfinder.dom.modalCloseButton.addEventListener('click', function() {
      thisPathfinder.dom.modal.classList.remove(classNames.pathfinder.modal.active);
    });
  }

  getSquareFromTableCell(cell) {
    const thisPathfinder = this;

    const coords = cell.getAttribute('id').replace(settings.pathfinder.cellIdPrefix, '').split('-');
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    return thisPathfinder.matrix[x][y];
  }

  setHints() {
    const thisPathfinder = this;

    thisPathfinder.removeHints();
    const finder = new Finder(thisPathfinder.matrix);

    for (const square of finder.selectedSquares) {
      const neighbours = square.getLineNeighbours();

      for (const neighbour of neighbours) {
        if (!finder.matrix[neighbour.x][neighbour.y].selected) {
          const cell = document.getElementById(settings.pathfinder.cellIdPrefix + neighbour.x + '-' + neighbour.y);
          cell.classList.add(classNames.pathfinder.possibleNextSquare);
        }
      }
    }
  }

  removeHints() {
    const thisPathfinder = this;

    for (const row of thisPathfinder.dom.table.children) {
      for (const cell of row.children) {
        cell.classList.remove(classNames.pathfinder.possibleNextSquare);
      }
    }
  }

  canSelectSquare(clickedSquare) {
    const thisPathfinder = this;

    const canSelect = thisPathfinder.canToggleSquare(clickedSquare);

    if (!canSelect) {
      thisPathfinder.dom.error.innerHTML = strings.pathfinder.errors.cantSelectField;
    }

    return canSelect;
  }

  canUnselectSquare(clickedSquare) {
    const thisPathfinder = this;

    const canUnselect = thisPathfinder.canToggleSquare(clickedSquare);

    if (!canUnselect) {
      thisPathfinder.dom.error.innerHTML = strings.pathfinder.errors.cantUnselectField;
    }
    
    return canUnselect;
  }

  canToggleSquare(clickedSquare) {
    const thisPathfinder = this;

    // temporary toggle selected state
    clickedSquare.selected = !clickedSquare.selected;

    const finder = new Finder(thisPathfinder.matrix);
    const canToggle = finder.checkAllSquaresConnected();

    // restore selection
    clickedSquare.selected = !clickedSquare.selected;

    return canToggle;
  }

  resetGrid() {
    const thisPathfinder = this;

    for (const row of thisPathfinder.dom.table.children) {
      for (const cell of row.children) {
        cell.innerHTML = '';
        cell.removeAttribute('class');
      }
    }

    thisPathfinder.initMatrix();
    thisPathfinder.startSquare = false;
    thisPathfinder.finishSquare = false;
  }

  fillAll(decreaseBy) {
    const thisPathfinder = this;

    thisPathfinder.resetGrid();

    for (let x = 0; x <= settings.pathfinder.maxX - decreaseBy; x++) {

      for (let y = 0; y <= settings.pathfinder.maxY - decreaseBy; y++) {
        thisPathfinder.matrix[x][y].selected = true;
        document.getElementById(settings.pathfinder.cellIdPrefix + x + '-' + y).classList.add(classNames.pathfinder.selected);
      }
    }
  }
}

export default Pathfinder;