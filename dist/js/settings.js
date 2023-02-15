export const select = {
  containerOf: {
    pathfinder: '.pathfinder-container',
    pages: '.content',
  },

  pathfinder: {
    gridWrapper: '.grid-wrapper',
    button: '.button',
    message: '.message',
    error: '.error',
  },

  menu: {
    links: '.menu a',
  },

  modal: {
    container: '.modal',
    routeFull: '.full-route-value',
    routeLongest: '.longest-route-value',
    routeShortest: '.shortest-route-value',
    modalCloseButton: '.modal-close-button',
  },
};

export const settings = {
  pathfinder: {
    maxX: 9, // start from 0
    maxY: 9, // start from 0
    cellIdPrefix: 'cell-',
    maxSearchExecutionTime: 200, // in miliseconds
  },
};

export const classNames = {
  pathfinder: {
    selected: 'selected',
    start: 'start',
    finish: 'finish',
    markedPath: 'shortest-path',
    possibleNextSquare: 'possible-next-square',
    modal: {
      active: 'active',
    },
  },

  menu: {
    active: 'active',
  },

  pages: {
    active: 'active',
  },
};

export const strings = {
  pathfinder: {
    buttons: {
      finishDrawing: 'finish drawing',
      compute: 'compute',
      startAgain: 'start again',
    },

    messages: {
      drawRoutes: 'draw routes',
      markStartFinish: 'pick start and finish',
      result: 'the best route is...',
    },

    errors: {
      cantSelectField: 'You can\'t select this field',
      cantUnselectField: 'You can\'t unselect this field',
      markStartFinish: 'Pick start and finish fields',
      selectTwoSquares: 'Select at least two squares',
    },

    text: {
      startSquare: 'Start',
      finishSquare: 'Finish',
    },
  },
};