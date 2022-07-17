class searchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    //clear seach field afer search
    this._clearInput();
    return query;
  }
  //clear input field once it is searched
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  //handler func here is the func in controller.js
  //we pass that func as a arg to this...so addhandlersearch is publisher and func in controller js is subscriber
  //we cant do func a->b as we cant add dom in controller and exec there or brinf the controller js
  // func logic here and add in view..so we do func(x)->x
  //where x is b
  addHandlerSearch(handler) {
    //we add event handler to parent here ..we listen to entire form and not only button
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
//we dont export class we export an instance just like for all
