"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage($allStoriesList);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  console.debug("generateStoryMarkup", story);

  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showDelete ? generateDeleteMarkup(story, currentUser) : ""}
        ${showStar ? generateStarMarkup(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
      </li>
    `);
}

/** Generates star icon HTML based on if the story is a favorite */

function generateStarMarkup(story, user) {
  if (user.isFavorite(story.storyId)) {
    return `<i class="fa-solid fa-star star"></i>`;
  } else {
    return `<i class="fa-regular fa-star star"></i>`
  }
}

/** Generates delete icon HTML based on if the story is a user's own story */

function generateDeleteMarkup(story, user) {
  if (user.isOwnStory(story.storyId)) {
    return `<i class="fa-solid fa-trash-can delete"></i>`;
  }
  return '';
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(olEl) {
  console.debug("putStoriesOnPage");

  olEl.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    olEl.append($story);
  }

  olEl.show();
}

/** Gets list of favorite stories from server, generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoritesList.empty();

  const { favorites } = currentUser;

  if (favorites.length == 0) {
    $favoritesList.append('<h5>No favorites added!</h5>');
  } else {
    // loop through all of our stories and generate HTML for them
    for (let story of favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }

  $favoritesList.show();
}

/** Gets list of ownStories from server, generates their HTML, and puts on page. */

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $ownStoriesList.empty();

  const { ownStories } = currentUser;

  if (ownStories.length == 0) {
    $ownStoriesList.append('<h5>No stories added!</h5>');
  } else {
    // loop through all of our stories and generate HTML for them
    for (let story of ownStories) {
      const $story = generateStoryMarkup(story, true);
      $ownStoriesList.append($story);
    }
  }

  $ownStoriesList.show();
}

/** Gets values of new story form when submitted, adds to story list on the server, gets new story list from the server, and shows */

async function submitNewStory(evt) {
  evt.preventDefault();

  const author = $('#story-author').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();

  $storyForm.trigger('reset');

  await StoryList.addStory(currentUser, 
    {title, author, url});

  storyList = await StoryList.getStories();
  putStoriesOnPage($submitStoriesList); 
  
  currentUser = await User.getUser(currentUser);
}

$storyForm.on("submit", submitNewStory);