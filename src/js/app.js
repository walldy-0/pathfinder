import Pathfinder from './components/Pathfinder.js';
import {select, classNames} from './settings.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.menuLinks = document.querySelectorAll(select.menu.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (const page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.menuLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    /* add class 'active' to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class 'active' to matching links, remove from non-matching */
    for (let link of thisApp.menuLinks) {
      link.classList.toggle(
        classNames.menu.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initPathfinder: function() {
    const pathfinderWrapper = document.querySelector(select.containerOf.pathfinder);

    new Pathfinder(pathfinderWrapper);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initPathfinder();
  },
};

app.init();