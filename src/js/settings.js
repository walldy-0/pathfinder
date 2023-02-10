export const select = {
  containerOf: {
    pathfinder: '.pathfinder-container',
  },

  pathfinder: {
    grid: '.grid-wrapper',
    button: '.button',
    message: '.message',
    error: '.error',
  },
};

export const settings = {
  pathfinder: {
    maxX: 9, // start from 0
    maxY: 9, // start from 0
    cellIdPrefix: 'cell-',
  },
};

export const classNames = {
  pathfinder: {
    selected: 'selected',
    start: 'start',
    finish: 'finish',
    markedPath: 'shortest-path',
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
  },
};