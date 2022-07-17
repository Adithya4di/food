import icons from '../../img/icons.svg';
import View from './views.js';
import previewView from './previewView';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `could'nt find any recipies based on search.search again`;
  _message = '';

  _generateMarkup() {
    //for every recipe in recipies array..we add the html and join it
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
