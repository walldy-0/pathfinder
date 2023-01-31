import Grid from './components/Grid.js';
import {select} from './settings.js';

const app = {
  initPathfinder: function() {
    const pathfinderWrapper = document.querySelector(select.containerOf.pathfinder);

    new Grid(pathfinderWrapper);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPathfinder();
  },
};

app.init();