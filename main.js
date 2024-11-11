const homeBtn = document.querySelector(".menu-link-home");
const popularBtn = document.querySelector(".menu-link-popular");
const topRatedBtn = document.querySelector(".menu-link-toprated");
const upcomingBtn = document.querySelector(".menu-link-upcoming");

const mainContent = document.querySelector(".main-content");

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
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?language=en-US`,
    options
  );
  const data = await response.json();
  return data;
}

// CREATE FEATURED MOVIE ON HOME PAGE -------------------------------

async function createFeatured() {
  const response = await getApiData("movie/now_playing");
  const data = await response.results;

  const number = generateRandomNumber();
  const featuredMovie = data[number];

  const featuredMovieDIV = document.createElement("div");
  featuredMovieDIV.classList.add("featured-movie");
  featuredMovieDIV.setAttribute(
    "style",
    `background-image: url('https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}')`
  );

  const featuredInfoDIV = document.createElement("div");
  featuredInfoDIV.classList.add("featured-info");

  const featuredTitle = document.createElement("h2");
  featuredTitle.classList.add("featured-title");
  featuredTitle.textContent = featuredMovie.title;

  const featuredSubText = document.createElement("p");
  featuredSubText.classList.add("featured-subtext");
  featuredSubText.textContent = featuredMovie.overview;

  const btn = document.createElement("button");
  btn.classList.add("featured-btn");
  btn.setAttribute("data-id", featuredMovie.id);
  btn.textContent = "More Info";
  btn.addEventListener("click", function () {
    console.log(this.dataset.id);
    createSingleMoviePage(this.dataset.id);
  });

  featuredInfoDIV.appendChild(featuredTitle);
  featuredInfoDIV.appendChild(featuredSubText);
  featuredInfoDIV.appendChild(btn);
  featuredMovieDIV.appendChild(featuredInfoDIV);

  mainContent.childNodes.forEach((node) => {
    if (node.classList.contains("top-movies-container")) {
      mainContent.insertBefore(featuredMovieDIV, node);
    }
  });
}

// CREATE TOP 5 MOVIES ON HOME PAGE ---------------------------------

async function createTop5Movies() {
  const response = await getApiData("movie/popular");
  const data = await response.results;

  const topMoviesDIV = document.createElement("div");
  topMoviesDIV.classList.add("top-movies-container");

  const sectionText = document.createElement("h3");
  sectionText.classList.add("top-movies-section-text");
  sectionText.textContent = "Top 5 Movies";

  topMoviesDIV.appendChild(sectionText);

  for (let i = 0; i <= 4; i++) {
    const movieDIV = document.createElement("div");
    movieDIV.classList.add("top-movie");
    movieDIV.setAttribute("data-id", data[i].id);

    const movieIMG = document.createElement("img");
    movieIMG.classList.add("top-movie-img");
    movieIMG.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${data[i].poster_path}`
    );
    movieIMG.setAttribute("alt", "movie poster");

    const movieTextBoxDIV = document.createElement("div");
    movieTextBoxDIV.classList.add("top-text-box");

    const movieTitle = document.createElement("p");
    movieTitle.classList.add("top-title");
    movieTitle.textContent = data[i].title;

    const movieDescription = document.createElement("p");
    movieDescription.classList.add("top-description");
    movieDescription.textContent = `${data[i].overview.substring(0, 75)} ...`;

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("top-btn");
    movieBtn.setAttribute("data-id", data[i].id);
    movieBtn.textContent = "More Info";

    movieTextBoxDIV.appendChild(movieTitle);
    movieTextBoxDIV.appendChild(movieDescription);
    movieTextBoxDIV.appendChild(movieBtn);
    movieDIV.appendChild(movieIMG);
    movieDIV.appendChild(movieTextBoxDIV);
    topMoviesDIV.appendChild(movieDIV);

    mainContent.childNodes.forEach((node) => {
      if (node.classList.contains("top-shows-container")) {
        mainContent.insertBefore(topMoviesDIV, node);
      }
    });
  }
}

// CREATE TOP 5 SHOWS ON HOME PAGE ---------------------------------

async function createTop5Shows() {
  const response = await getApiData("tv/popular");
  const data = await response.results;

  const topShowsDIV = document.createElement("div");
  topShowsDIV.classList.add("top-shows-container");

  const sectionText = document.createElement("h3");
  sectionText.classList.add("top-shows-section-text");
  sectionText.textContent = "Top 5 TV Shows";

  topShowsDIV.appendChild(sectionText);

  for (let i = 0; i <= 4; i++) {
    const showDIV = document.createElement("div");
    showDIV.classList.add("top-show");
    showDIV.setAttribute("data-id", data[i].id);

    const showIMG = document.createElement("img");
    showIMG.classList.add("top-show-img");
    showIMG.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${data[i].poster_path}`
    );
    showIMG.setAttribute("alt", "tv show poster");

    const showTextBoxDIV = document.createElement("div");
    showTextBoxDIV.classList.add("top-text-box");

    const showTitle = document.createElement("p");
    showTitle.classList.add("top-title");
    showTitle.textContent = data[i].name;

    const showDescription = document.createElement("p");
    showDescription.classList.add("top-description");
    showDescription.textContent = `${data[i].overview.substring(0, 75)} ...`;

    const showBtn = document.createElement("button");
    showBtn.classList.add("top-btn");
    showBtn.setAttribute("data-id", data[i].id);
    showBtn.textContent = "More Info";

    showTextBoxDIV.appendChild(showTitle);
    showTextBoxDIV.appendChild(showDescription);
    showTextBoxDIV.appendChild(showBtn);
    showDIV.appendChild(showIMG);
    showDIV.appendChild(showTextBoxDIV);
    topShowsDIV.appendChild(showDIV);

    mainContent.childNodes.forEach((node) => {
      if (node.classList.contains("footer")) {
        mainContent.insertBefore(topShowsDIV, node);
      }
    });
  }
}

// CREATE FOOTER AT BOTTOM OF THE PAGE ------------------------------

function createFooter() {
  const footerDIV = document.createElement("div");
  footerDIV.classList.add("footer");

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
  footerDIV.appendChild(inspirationPara);
  footerDIV.appendChild(apiPara);
  footerDIV.appendChild(apiIMG);
  mainContent.appendChild(footerDIV);
}

// CREATE SINGLE MOVIE INFO PAGE ON HOME PAGE ----------------------

async function createSingleMoviePage(id) {
  const data = await getApiData(`movie/${id}`);
  console.log(data);

  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }

  const selectedMovieDIV = document.createElement("div");
  selectedMovieDIV.classList.add("featured-movie");
  selectedMovieDIV.setAttribute(
    "style",
    `background-image: url('https://image.tmdb.org/t/p/original${data.backdrop_path}')`
  );
  mainContent.appendChild(selectedMovieDIV);
}

// CREATE FULL HOME PAGE -------------------------------------------

function createHome() {
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }
  createFooter();
  createTop5Shows();
  createTop5Movies();
  createFeatured();
}

createHome();
