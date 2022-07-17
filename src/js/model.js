//import { search } from 'core-js/fn/symbol';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
//import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers.js';
//always import as *..i.e entire ele or {} and destructure them so that we need not use module.method..we can simply use method after destructure
//we export state to use it in controller
//controller grabs all data from here
//state has all the data that we manipulate in the func
export const state = {
  //details about a recipe..we get data and store it in this state.recipe below and use this obj further
  recipe: {},
  //once we implement search, we get array of all recipies by the search name..we get those values by data.data.recipies and now we store them in here along with the searched name.
  //we have results arr with all recipies based on search, where each index has obj that contains info about a recipe
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  //we have api data in data variable...and response of variable has a data obj that has all info about recipies..so instead of data.data.recipies..we can use obj destructuring

  const { recipe } = data.data;

  //create new recipe obj now
  //we have recipe obj..so we can have obj varibles from that recipe methods..i.e we can create a id var from recipe.id from above recipe and put it in our recipe var as it is declared by let keyword
  //IMPORTANT: recipe is const that import data in model.js..so we use state.recipe to change values and not the above recipe..so we made the above one as const
  //on rhs side we have recipe obj we got from data api..it has methods
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //we only add key while adding/uploading recipes..we dont do it while loading recipe ..so if check if our recipe obj has key prop and then add it
    ...(recipe.key && { key: recipe.key }),
  };
  //console.log(state.recipe);
};

//we also write load recipe func here to load our recipe and export to controller
//id is imported from controller when it calls load recipe func
//the func wont return anything..it only changes state obj which will be exported
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //everytime recipe is loaded from api..so previous bookmarks are removed..so we check if there are any bookmarks in array and update them 1st
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`this is an ${err}`);
    //we throw it here again as we want to display msg in view and since view and model are not connected we do it by controller
    //so we call the error method in view.js from controller and that takes this error msg as parameter
    throw err;
  }
};
//this func is called by controller by passing a query and we take the query and apply search
export const loadSearchResults = async function (query) {
  try {
    console.log(query);
    //store search in state.search
    //search has all data based on user searched name
    state.search.query = query;
    //kjust like load recipe..we call get json method with url from forkify api for search
    //the getjson fetches data..gets json format of file and returns the data...getjson in helper.js
    const data = await AJAX(`${API_URL}?search=${query}&&key=${KEY}`);
    //console.log(data);
    //data obj has another data obj in it..and there is a recipies obj in it which contains list of all recipies with the search provided..so we store it 1st
    //just like above load recipe..we create new obj to store all these info coming from api
    //recipies is array of all recipies in data obj..so we use map func to create new array which contains all the properties of every arr..ie the rec in the map is every single variable in recipies array...for each recipe we create obj of all props of the recipe and add it to array.
    //new array is now arr of obj where every index has an object about a recipe
    //console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    //when new search result  is loaded the page number is not set back to 1..so
    state.search.page = 1;
    //console.log(state.search.results);
  } catch (err) {
    //just  like load recipe func catch block
    console.error(`this is an ${err}`);
    throw err;
  }
};
//we use the func to implement pagination..the results are already loaded so we need not use await func..we are just dividing results into pages
//page param gets the data for that particular page
//page param is the page number we get from user..and we then display recipies in that page in that range..
//setting a default page value of 1 to it
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  //our results of recipies are in results arr in state obj
  //if page is 1..then we display from 0-10th ele..so 1-1*10 is 0 and 1*10 is 10..similarly with page number given..we can get the corresponding values
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  //slice wont consider end value..it only takes upto end -1..so it is okay to give end directly
  //we slice from 0,10 in page1..so it slices upto 9th element
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //ingredients in state obj has quantity property..so we update quantity based on servigs
  //we dont need new arr so we use foreach to just effect some func in arr .we can create a new arr and override with older one too
  state.recipe.ingredients.forEach(ing => {
    //new servings * new quantity / old quantity
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

//we store data in local storage whenever we add or delete bookmarks..
const persistBookmarks = function () {
  //we can directly use local storage to modify
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark curr recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //mark curr recipe as not a bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  let store = localStorage.getItem('bookmarks');
  if (store) state.bookmarks = JSON.parse(store);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//to upload our recipe onto site we need to make a request to the api
export const uploadRecipe = async function (newRecipe) {
  try {
    //we can take ingridients in an arr and store them..so 1st we need to get ingredients out of recipe obj..so 1st convert recipe into array
    //console.log(Object.newRecipe);
    //new recipe is an obj of arrays where every arr 1st index has the proprty of it
    //we have source, servings, time, description, publisher, image , ingreidents etc..so we need to filter ingredients among them
    //checking if 1st index has ingredients..then checking if that array actually has any ingredient or if its empty arr ..ex: there can be only 3 ingredients so other 3 arr will not have any ele in 1st index..so once we filter our recipes..now for every recipe , using arr destructor we divide them into quantity value and name
    //then we remove all white spaces in arr and map the entire ing arr into new arrr with quantity unit and description values
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('wrong ingredients given, please use correct format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //create a recipe the way api receives it..api receives it in certain keywords..so give them
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);
    // console.log(ingredients);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    //console.log(data);
  } catch (err) {
    throw err;
  }
};
