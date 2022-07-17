import View from './views.js';

import icons from '../../img/icons.svg';
//fractional module to convert decimals into fractions for ingredients
//fractional module have a func fraction to convert into fractions
//so we used destructuring to get it..else we should use fractional.fraction..so simply we got fraction method imported..we can create new fraction with new fraction and pass the value as constructor parameter in it..then it converts it into fraction..we can later make it into string and then add back to our function(at map func in generate recipes ingredient section and quantity)
//we check if value exists to qunatity bu ?. method..if yes we use fraction..else ''
import { Fraction } from 'fractional';
//console.log(Fraction);
//we import site location modules as we cant publish the path saved in our pc into dist folder
//we save them by importing here..and they are imported as icons..can be done with any name

//we'll have a parent class view that will have methods which have to be shared by every view obj
//we can then export the entire class to controller..which on importing will create an obj with this class(new recipe view obj)..but creating more than one view in controller can be a burden to it..so we create our obj here and then export
class recipeView extends View {
  //we can have private parent element to every view as we can easily render spinner or add html
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `could'nt find the recipe. please find by another name`;
  _message = '';

  //publisher subscriber pattern..check notes..
  addHandlerRender(handler) {
    //we can get hash value from url and control recipies based on their id value and also load pages based on hash value..we can add hash event to get it
    //window.addEventListener('hashchange', controlRecipe);
    //copying url and adding to new page wont control recipe based on hash id as we didnt give hash value to laod event..so we add same func to load event also
    //window.addEventListener('load', controlRecipe);
    //if we are calling same call back on same event handler many times..we can add a short cut func to it..loop all handlers and call for each...every time we loop..we loop through an event..i.e in 1st loop..ev is hashchange and in 2nd one ev is load in for each loop
    //events are ui logic..so they should be in view..but call back func controlrecipies in in controller..so we cant put control recipies in view as it is app logic and views cant have app logic..similarly we can put dom event in controller as presentation logic goes in view..we cant import controller in view as view should know nothing about it
    //so we pass the call back as arg to addhandler func and then implement it in here..
    //instead of a implementing b directly..ehich we cant do..we pass in b as arg to a
    ['hashchange', 'load'].forEach(ev => addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    //we do event delegation again..add handler to parent..check if buttons are clicked inside..else just return..if buttons are returned we can use closest() to get the button that was clicked
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      //we have update-to class in dataset for each button...so we can destrcture our update to variable from it
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    //2.rendering recipe
    //we create new ingredient li for every ing and generate a string to join to our html.so we can use map to create new arr of strings to add in ingredients
    //every ingredient obj has quantity description and unit..so in map func..we use that ing obj..so we can replace words with ing.unit quantity and description\\
    //we get new arr from map..we use join method to make it into string
    //exec happens from dist folder..all files and hrefs and srcs name change in dst..this is shipping folder..so we dont have pc location here...but our html have pc locations..so we cant load imgs..so to load them..we can do that with parcel ..we import imgs and icons by specifying path from our js file to the img or svc file

    return `
  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings - 1
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated">    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
    `;
  }
  _generateMarkupIngredient(ing) {
    // console.log(ing.quantity);
    return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
  }
}
//we export the obj to controller..this also helps in keeping class private as only obj has access to it and entire class is not exported
export default new recipeView();
