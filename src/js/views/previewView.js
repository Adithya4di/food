import icons from '../../img/icons.svg';
import View from './views.js';

class previewView extends View {
  _parentElement = '';

  _generateMarkup(result) {
    const id = window.location.hash.slice(1);
    //elements has a previewlinkactive class..so we can get id of the ele, compare it with the page ele and render results of recipe

    return `
    <li class="preview">
            <a class="preview__link ${
              this._data.id === id ? 'preview__link - active' : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
              </div>
            </a>
          </li>
    `;
  }
}

export default new previewView();
