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

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const userLoggedIn = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${userLoggedIn ? generateStarMarkup(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/**  */
function generateStarMarkup(story, user) {
  const isStoryFavorite = user.isFavorite(story.storyId);

  if (isStoryFavorite) {
    return `<i class="fa-solid fa-star"></i>`;
  } else {
    return `<i class="fa-regular fa-star"></i>`
  }
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
}

$storyForm.on("submit", submitNewStory);