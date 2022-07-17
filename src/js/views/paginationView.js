import icons from '../../img/icons.svg';
import View from './views.js';

class paginationView extends View {
  _data;
  _parentElement = document.querySelector('.pagination');

  //we call event listener in controller and response them in here for 2 buttons
  //we add event to parent..so we can handle both buttons at a time..
  //every button has a btn--inline class...so we select the clicked element and find the closest btn--inline class to it..so we can handle the button clicked
  //handler is the controlPagination func passed which is called here
  //every button has data attr ..named data--goto and all data attr can be accessed by dataset
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      //+ to convert string to num..we pass these page numbers back to controller so we can render these results
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  //every class inherited from view has generate markup method to create appropriate html for the view
  //generate markup is called from view
  //we've called render method in controller and the render method..assigns this.data to the data received and calls generate markup..we do that as we cant connect view and model directly
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //we have 4 scenarios
    //we use data attr on all buttons so that we can access them to access the page
    //1.we are on page 1  and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto=${
        currPage + 1
      } class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    //3.last page with only back option
    //data equals numPages happens when there the results are only 1 page..then our 1st page is the last page too..so we add pages>1 specifically for last pages
    if (currPage === numPages && numPages > 1) {
      return `
      <button data-goto=${
        currPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
      `;
    }

    //4.middle pages with both back and next options
    if (currPage < numPages) {
      return `
      <button data-goto=${
        currPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goto=${
            currPage + 1
          } class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    //
    //if all conditions are false we are left with 2.
    //2.page 1 and no need of other pages
    console.log('only one');
    return ``;
  }
}

export default new paginationView();
