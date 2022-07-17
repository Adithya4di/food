import icons from '../../img/icons.svg';
import View from './views.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'recipe successfully created';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    //we've defined super and then this method..so this method is only available in this class
    //but this class has to be imported and executed in controller else it'll be called from nowhere
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  //on adding event the overlay is just visible to user..there is no app logic here..so we need not implement event handler in controller
  _addHandlerShowWindow() {
    //for event handler..this keyword is the ele calling it..so here the this is btnOpen..so we create a function and bind the proper this keyword there
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //formdata method can be used to take form as input and convert it into obj
      //here our parent class itself is the form..and the event is called using parent element..so the this in handler is parent element of form..so we can use this directly without binding
      //we cant use the obj from formdata() to retreive ele..so we use spread operator to make it into arr
      const dataArr = [...new FormData(this)];
      //takes dataarr entries and convert them into obj
      const data = Object.fromEntries(dataArr);
      //console.log(data);
      handler(data);
    });
  }

  //every class inherited from view has generate markup method to create appropriate html for the view
  //generate markup is called from view
  //we've called render method in controller and the render method..assigns this.data to the data received and calls generate markup..we do that as we cant connect view and model directly
  _generateMarkup() {}
}

export default new addRecipeView();
