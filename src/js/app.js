import {select} from './settings.js';

const app = {
  initPathfinder: function() {
    const pathfinderWrapper = document.querySelector(select.containerOf.pathfinder);

    console.log(pathfinderWrapper);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPathfinder();
  },
};

app.init();