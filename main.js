const homeBtn = document.querySelector(".menu-link-home");
const popularBtn = document.querySelector(".menu-link-popular");
const topRatedBtn = document.querySelector(".menu-link-toprated");
const upcomingBtn = document.querySelector(".menu-link-upcoming");

homeBtn.addEventListener("click", createHome);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// GENERATE RANDOM NUMBER FROM 0 TO 19 ------------------------------

function generateRandomNumber() {
  return Math.floor(Math.random() * 20);
}

// GET  DATA FROM THE TMDB API --------------------------------------

async function getApiData(endpoint) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2JhYzQ5MTdhYjUxOGRiNGNiNjQ0YWViYWE3YWU2ZSIsIm5iZiI6MTczMTA3Mjg0MC40NzY0MzIzLCJzdWIiOiI2NWM1ZjdjNGJkNTg4YjAxNjM0NTMxMTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.BGvQjFk9dFg2_dIxBV76Q1mc6r-Qa03OpHRzGTvP908",
    },
  };

  showSpinner();

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?language=en-US`,
    options
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

// CREATE FEATURED MOVIE ON HOME PAGE -------------------------------

async function createFeatured() {
  const response = await getApiData("movie/now_playing");
  const data = await response.results;

  const number = generateRandomNumber();
  const movie = data[number];

  const featuredContainer = document.querySelector(".featured");
  clearContainer(".home-page", ".featured");

  const featuredDIV = document.createElement("div");
  featuredDIV.classList.add("featured-movie");
  featuredDIV.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  const featuredInfoDIV = document.createElement("div");
  featuredInfoDIV.classList.add("featured-info");

  const featuredTitle = document.createElement("h2");
  featuredTitle.classList.add("featured-title");
  featuredTitle.textContent = movie.title;

  const featuredSubText = document.createElement("p");
  featuredSubText.classList.add("featured-subtext");
  featuredSubText.textContent = movie.overview;

  const btn = document.createElement("button");
  btn.classList.add("featured-btn");
  btn.setAttribute("data-id", movie.id);
  btn.textContent = "More Info";
  btn.addEventListener("click", function () {
    createMovieDetailsPage(this.dataset.id);
  });

  featuredInfoDIV.appendChild(featuredTitle);
  featuredInfoDIV.appendChild(featuredSubText);
  featuredInfoDIV.appendChild(btn);
  featuredDIV.appendChild(featuredInfoDIV);

  featuredContainer.appendChild(featuredDIV);
}

// CREATE TOP 5 MOVIES ON HOME PAGE ---------------------------------

async function createTop5Movies() {
  const response = await getApiData("movie/popular");
  const data = await response.results;

  createTop5(data, ".top5-movies", "Movies", createMovieDetailsPage);
}

// CREATE TOP 5 SHOWS ON HOME PAGE ---------------------------------

async function createTop5Shows() {
  const response = await getApiData("tv/popular");
  const data = await response.results;

  createTop5(data, ".top5-shows", "Shows", createShowDetailsPage);
}

// CREATE TOP 5 CONTAINERS -----------------------------------------

function createTop5(data, classSelector, subject, functionName) {
  const top5Container = document.querySelector(classSelector);
  clearContainer(".home-page", classSelector);

  const mainDIV = document.createElement("div");
  mainDIV.classList.add("top5-container");

  const sectionText = document.createElement("h3");
  sectionText.classList.add("top5-section-text");
  sectionText.textContent = `Top 5 ${subject}`;

  mainDIV.appendChild(sectionText);

  for (let i = 0; i <= 4; i++) {
    const innerDIV = document.createElement("div");
    innerDIV.classList.add("top5-item");
    innerDIV.setAttribute("data-id", data[i].id);

    const subjectIMG = document.createElement("img");
    subjectIMG.classList.add("top5-img");
    subjectIMG.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${data[i].poster_path}`
    );
    subjectIMG.setAttribute("alt", "movie poster");

    const subjectTextBox = document.createElement("div");
    subjectTextBox.classList.add("top5-text-box");

    const subjectTitle = document.createElement("p");
    subjectTitle.classList.add("top5-title");
    subjectTitle.textContent = data[i].title ? data[i].title : data[i].name;

    const subjectDesc = document.createElement("p");
    subjectDesc.classList.add("top5-description");
    subjectDesc.textContent = `${data[i].overview.substring(0, 75)} ...`;

    const subjectBtn = document.createElement("button");
    subjectBtn.classList.add("top5-btn");
    subjectBtn.setAttribute("data-id", data[i].id);
    subjectBtn.textContent = "More Info";
    subjectBtn.addEventListener("click", function () {
      functionName(this.dataset.id);
    });

    subjectTextBox.appendChild(subjectTitle);
    subjectTextBox.appendChild(subjectDesc);
    subjectTextBox.appendChild(subjectBtn);
    innerDIV.appendChild(subjectIMG);
    innerDIV.appendChild(subjectTextBox);
    mainDIV.appendChild(innerDIV);

    top5Container.appendChild(mainDIV);
  }
}

// CREATE FOOTER AT BOTTOM OF THE PAGE ------------------------------

function createFooter(currentPage) {
  const footer = document.querySelector(`${currentPage} .footer`);
  clearContainer(".home-page", ".footer");

  const inspirationPara = document.createElement("p");
  inspirationPara.classList.add("inspiration");
  inspirationPara.textContent =
    "Design inspiration from Dribbble by Anton Tkachev";

  const linkDribbble = document.createElement("a");
  linkDribbble.textContent = "Unity Gaming I";
  linkDribbble.setAttribute(
    "href",
    "https://dribbble.com/shots/14392022-Unity-Gaming-I?utm_source=pinterest&utm_campaign=pinterest_shot&utm_content=Unity+Gaming+I&utm_medium=Social_Share"
  );

  const apiPara = document.createElement("p");
  apiPara.classList.add("api");
  apiPara.textContent = "API used for this project ";

  const linkAPI = document.createElement("a");
  linkAPI.textContent = "TMDB - The Movie DataBase";
  linkAPI.setAttribute(
    "href",
    "https://developer.themoviedb.org/docs/getting-started"
  );

  const apiIMG = document.createElement("img");
  apiIMG.setAttribute("src", "./img/blue_long.svg");
  apiIMG.setAttribute("alt", "the movie database api logo");

  inspirationPara.appendChild(linkDribbble);
  apiPara.appendChild(linkAPI);
  footer.appendChild(inspirationPara);
  footer.appendChild(apiPara);
  footer.appendChild(apiIMG);
}

// CREATE SINGLE MOVIE INFO PAGE ON HOME PAGE ----------------------

async function movieDetailsPage(id) {
  const data = await getApiData(`movie/${id}`);

  const selectedIMG = document.querySelector(".selected-img");
  selectedIMG.style.backgroundImage = `linear-gradient(to bottom, transparent, rgba(31, 32, 41)), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("selected-title-container");

  const title = document.createElement("h2");
  title.classList.add("selected-title");
  title.textContent = data.title;

  const btn = document.createElement("button");
  btn.classList.add("selected-btn");
  btn.setAttribute("data-id", data.id);
  btn.textContent = "Add to Favourites";
  btn.addEventListener("click", function () {
    console.log("console favourites");
  });

  const selectedInfo = document.querySelector(".selected-info");

  const stars = document.createElement("p");
  stars.classList.add("selected-stars");
  stars.innerHTML = `<i class="fa-solid fa-star"></i> ${Number.parseFloat(
    data.vote_average
  ).toFixed(1)} / 10`;

  const releaseDate = document.createElement("p");
  releaseDate.classList.add("selected-release");
  const date = new Date(data.release_date);
  releaseDate.innerHTML = `<strong>Release Date:</strong> ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;

  const description = document.createElement("p");
  description.classList.add("selected-description");
  description.innerHTML = `<strong>Description:</strong> ${data.overview}`;

  const runtime = document.createElement("p");
  runtime.innerHTML = `<strong>Runtime:</strong> ${data.runtime} minutes`;

  const genres = document.createElement("p");
  const genreText = [];
  data.genres.forEach((genre) => genreText.push(genre.name));
  genres.innerHTML = `<strong>Genres:</strong> ${genreText.join(", ")}`;

  const originalLanguage = document.createElement("p");
  originalLanguage.innerHTML = `<strong>Original Language:</strong> ${data.original_language.toUpperCase()}`;

  titleContainer.appendChild(title);
  titleContainer.appendChild(btn);
  selectedIMG.appendChild(titleContainer);
  selectedInfo.appendChild(stars);
  selectedInfo.appendChild(releaseDate);
  selectedInfo.appendChild(description);
  selectedInfo.appendChild(runtime);
  selectedInfo.appendChild(genres);
  selectedInfo.appendChild(originalLanguage);
}

// CREATE SINGLE SHOW INFO PAGE ON HOME PAGE ----------------------

async function showDetailsPage(id) {
  const data = await getApiData(`tv/${id}`);

  const selectedIMG = document.querySelector(".selected-img");
  selectedIMG.style.backgroundImage = `linear-gradient(to bottom, transparent, rgba(31, 32, 41)), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("selected-title-container");

  const title = document.createElement("h2");
  title.classList.add("selected-title");
  title.textContent = data.name;

  const btn = document.createElement("button");
  btn.classList.add("selected-btn");
  btn.setAttribute("data-id", data.id);
  btn.textContent = "Add to Favourites";
  btn.addEventListener("click", function () {
    console.log("console favourites");
  });

  const selectedInfo = document.querySelector(".selected-info");

  const stars = document.createElement("p");
  stars.classList.add("selected-stars");
  stars.innerHTML = `<i class="fa-solid fa-star"></i> ${Number.parseFloat(
    data.vote_average
  ).toFixed(1)} / 10`;

  const releaseDate = document.createElement("p");
  releaseDate.classList.add("selected-release");
  const firstDate = new Date(data.first_air_date);
  releaseDate.innerHTML = `<strong>Release Date:</strong> ${firstDate.getDate()} ${
    months[firstDate.getMonth()]
  } ${firstDate.getFullYear()}`;

  const lastAirDate = document.createElement("p");
  const lastDate = new Date(data.last_air_date);
  lastAirDate.innerHTML = `<strong>Latest Air Date:</strong> ${lastDate.getDate()} ${
    months[lastDate.getMonth()]
  } ${lastDate.getFullYear()}`;

  const description = document.createElement("p");
  description.classList.add("selected-description");
  description.innerHTML = `<strong>Description:</strong> ${data.overview}`;

  const runtime = document.createElement("p");
  runtime.innerHTML = `<strong>Episode Runtime:</strong> ${data.episode_run_time} minutes`;

  const genres = document.createElement("p");
  const genreText = [];
  data.genres.forEach((genre) => genreText.push(genre.name));
  if (genreText.length === 0) {
    genres.innerHTML = `<strong>Genres:</strong> None`;
  } else {
    genres.innerHTML = `<strong>Genres:</strong> ${genreText.join(", ")}`;
  }

  const episodes = document.createElement("p");
  episodes.innerHTML = `<strong>Episodes:</strong> ${data.number_of_episodes}`;

  const seasons = document.createElement("p");
  seasons.innerHTML = `<strong>Seasons:</strong> ${data.number_of_seasons}`;

  const originalLanguage = document.createElement("p");
  originalLanguage.innerHTML = `<strong>Original Language:</strong> ${data.original_language.toUpperCase()}`;

  titleContainer.appendChild(title);
  titleContainer.appendChild(btn);
  selectedIMG.appendChild(titleContainer);
  selectedInfo.appendChild(stars);
  selectedInfo.appendChild(lastAirDate);
  selectedInfo.appendChild(releaseDate);
  selectedInfo.appendChild(description);
  selectedInfo.appendChild(runtime);
  selectedInfo.appendChild(genres);
  selectedInfo.appendChild(episodes);
  selectedInfo.appendChild(seasons);
  selectedInfo.appendChild(originalLanguage);
}

// SHOW AND HIDE SPINNER -------------------------------------------

function showSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("hidden");
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.add("hidden");
}

// CLEAR CONTAINERS ------------------------------------------------

function clearContainer(parent, className) {
  const container = document.querySelector(`${parent} ${className}`);
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
}

// CREATE FULL HOME PAGE -------------------------------------------

function createHome() {
  const singlePage = document.querySelector(".single-page");
  singlePage.style.display = "none";
  singlePage.classList.add("hidden");

  createFeatured();
  createTop5Movies();
  createTop5Shows();
  createFooter(".home-page");

  const homePage = document.querySelector(".home-page");
  homePage.classList.remove("hidden");
}

// CREATE MOVIE DETAILS PAGE ---------------------------------------

function createMovieDetailsPage(id) {
  const homePage = document.querySelector(".home-page");
  homePage.classList.add("hidden");

  clearContainer(".single-page", ".selected-img");
  clearContainer(".single-page", ".selected-info");
  clearContainer(".single-page", ".footer");

  movieDetailsPage(id);
  createFooter(".single-page");

  const singlePage = document.querySelector(".single-page");
  singlePage.style.display = "grid";
  singlePage.classList.remove("hidden");
}

// CREATE SHOW DETAILS PAGE ---------------------------------------

function createShowDetailsPage(id) {
  const homePage = document.querySelector(".home-page");
  homePage.classList.add("hidden");

  clearContainer(".single-page", ".selected-img");
  clearContainer(".single-page", ".selected-info");
  clearContainer(".single-page", ".footer");

  showDetailsPage(id);
  createFooter(".single-page");

  const singlePage = document.querySelector(".single-page");
  singlePage.style.display = "grid";
  singlePage.classList.remove("hidden");
}

// RUN FIRST PAGE ON LOAD -----------------------------------------

createHome();
