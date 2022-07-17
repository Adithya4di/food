import icons from '../../img/icons.svg';
import View from './views.js';
import previewView from './previewView.js';

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it`;
  _message = '';

  //generate view to view the results of recipies on left
  //we've called render method on results.view in controller.js..we can see the render merhod in views.js
  //now render method assigns data value of class..//we have an arr of recipies in data which came from model..we assigned them in controller and called here in view
  //now we loop over every index in data and generate html for it
  //instead of rendering to dom..we convert all the bookmark renders into an array of strings using map method..then join method makes it a big string with all data
  _generateMarkup() {
    //for every recipe in recipies array..we add the html and join it
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new bookmarksView();
