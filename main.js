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
    `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=1`,
    options
  );
  const data = await response.json();
  return data.results;
}

// CREATE FEATURED MOVIE ON HOME PAGE -------------------------------

async function createFeatured() {
  const data = await getApiData("movie/now_playing");
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
  const data = await getApiData("movie/popular");
  console.log(data);

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
    movieBtn.textContent = "More Info";

    movieTextBoxDIV.appendChild(movieTitle);
    movieTextBoxDIV.appendChild(movieDescription);
    movieTextBoxDIV.appendChild(movieBtn);
    movieDIV.appendChild(movieIMG);
    movieDIV.appendChild(movieTextBoxDIV);
    topMoviesDIV.appendChild(movieDIV);

    mainContent.childNodes.forEach((node) => {
      if (node.classList.contains("footer")) {
        mainContent.insertBefore(topMoviesDIV, node);
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

// CREATE FULL HOME PAGE -------------------------------------------

function createHome() {
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }
  createTop5Movies();
  createFeatured();
  createFooter();
}

createHome();
