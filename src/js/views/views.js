import icons from '../../img/icons.svg';
//recipe and result view has common features like spinner..error msgs..handlers etc..so we create a parent class view to both of them so they both can inherit it..we directly export class here as we dont create any instance of this class and we import whole class functionality to other views
export default class view {
  _data;
  //render recieves data for all views and initializes it..so we wont write any other func body in here..we keep it clean as it is a parent method
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    //we've selected the ele above..it has the recipe obj in _data passed in controller through render method
    //now we'll add the above html to it
    //but before we remove html if there was any
    //console.log(this._data.cookingTime, this._data.publisher);
    //every view has their own generate markup() based on the html they display..we call it here
    const recipeMarkup = this._generateMarkup();

    if (!render) return recipeMarkup;
    //to clear recipe container previous text..we call clear method to clean and then addd our text
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', recipeMarkup);
  }

  update(data) {
    this._data = data;
    //we've selected the ele above..it has the recipe obj in _data passed in controller through render method
    //now we'll add the above html to it
    //but before we remove html if there was any
    //console.log(this._data.cookingTime, this._data.publisher);
    //every view has their own generate markup() based on the html they display..we call it here
    const newMarkup = this._generateMarkup();
    //we are only updating markup here..so we need not generate whole markup for it..we can compare current markup with previous one and make changes
    //but the element is string, so it becomes a huge task to compare entire string markup..so we can convert this markup string into a dom obj..so we can compare with actual dom tree on page
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //now newdom ele becomes a huge dom ele..like the virtual dom..not on page but on memory..we can use newdom.queryselectorall('*') to get all ele of this dom..that gives a huge dom tree with all ele on the page..
    const newElements = Array.from(newDom.querySelectorAll('*'));
    //now if we update anything on page..the newdom tree remain same but dom on page is changed..so we can look for changed ele by compare newdom ele and page dom and apply render method
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //cur ele is the page dom..now we compare newdom to the page dom by converting both of them into arrays

    newElements.forEach((newEl, i) => {
      const curElement = curElements[i];
      //we can use isEqualNode() method to compare
      //it compare every single dom ele in both of them..and right from the parent ele to the current ele it returns false if there is a change in ele
      //ex: servings number is diff in both..then we get false at servings container..then at ele..then at span value number..we get false at entire pagination tab..then page buttons..then number on buttons..we get false values right from parent to ele;
      //we update when both values are not equal
      //UPDATING TEXT FIELDS
      if (
        !newEl.isEqualNode(curElement) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //curele.text equals newel.content changes entire element on the page, not only value..so we lose all the class names and fields..we only have text field available from new el dom arr..
        //so we use nodevalue property in condition to get the text field and compare only text and not entire ele..because in above lines.. we've seen that entire container is false when one value is changed in it..so along with isequalnode we use nodevalue to only get value and not entire field
        curElement.textContent = newEl.textContent;
      }
      //we've only changed values..but we are not updating html attributes to the elements..
      //so from current servings 4..we could only move to 3 and 5
      //UPDATING ATTRIBUTES
      if (!newEl.isEqualNode(curElement)) {
        console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curElement.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  //add spinner until page loads
  //css spinner has rotation animation set to infinite..so it will rotate forvver
  //animation :rotate 2s infinite linear..for rotate we have a method using key frames
  //@keyframes rotate..which has transform properties to rotate by 360 deg
  renderSpinner() {
    const spinnerMarker = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarker);
  }

  //rendering error in view(ui) instead of console(model)
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    //clears previous data from parent before adding our data
    this._parentElement.innerHTML = '';
  }
}
