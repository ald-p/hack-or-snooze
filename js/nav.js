"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage($allStoriesList);
}

$body.on("click", "#nav-all", navAllStories);

/** Show story form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $storyForm.show();
  putStoriesOnPage($submitStoriesList);
}

$navSubmit.on("click", navSubmitClick);

/** Show favorites list on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  $favoritesList.show();
  putFavoriteStoriesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** Show ownStories list on click on "my stories" */

function navOwnStoriesClick(evt) {
  console.debug("navOwnStoriesClick", evt);
  hidePageComponents();
  $ownStoriesList.show();
  putOwnStoriesOnPage();
}

$navOwnStories.on("click", navOwnStoriesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
