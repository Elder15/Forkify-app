import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeViews';
import resultView from './views/resultView';
import searchViews from './views/searchViews';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// import { from } from 'core-js/core/array';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// const testData = `5ed6604591c37cdc054bc886`;
// const testData2 = `5ed6604591c37cdc054bcac4`;

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // 1. loading recipe
    recipeView.renderSpinner();

    // 2. Update results view to mark selected search result
    resultView.update(model.getSearchResultpage());

    // 3. updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 4. Loading recipe
    await model.loadRecipe(id);

    // 5. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // console.log(resultView);

    // 1. Getsearch results
    const query = searchViews.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultView.render(model.getSearchResultpage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resultView.render(model.getSearchResultpage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServing(newServings);

  // Upload the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/ remove boookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Loading spinner
    addRecipeView.renderSpinner();
    // Sucess Message
    addRecipeView.renderSuccessMessage();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchViews.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
