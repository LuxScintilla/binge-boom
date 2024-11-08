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
  console.log(data);

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

  // BROKEN HERE CONTINUE HERE BROKEN HERE CONTINUE HERE!!!!!!!!!!!!!!!!

  // mainContent.appendChild(featuredMovieDIV);
  console.log(mainContent.childNodes[0].classList.contains("footer"));
  // mainContent.insertBefore(
  //   featuredMovieDIV,
  //   mainContent.childNodes.classList.contains("footer")
  // );
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

  inspirationPara.appendChild(linkDribbble);
  apiPara.appendChild(linkAPI);
  footerDIV.appendChild(inspirationPara);
  footerDIV.appendChild(apiPara);
  mainContent.appendChild(footerDIV);
}

// CREATE FULL HOME PAGE -------------------------------------------

function createHome() {
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }
  createFeatured();
  createFooter();
}

createHome();
