const mainContent = document.querySelector(".content");
const homeBtn = document.querySelector(".menu-link-home");
const popularBtn = document.querySelector(".menu-link-popular");
const topRatedBtn = document.querySelector(".menu-link-toprated");
const upcomingBtn = document.querySelector(".menu-link-upcoming");
const searchInput = document.querySelector(".search-input");
const favouriteList = document.querySelector(".fav-list");

homeBtn.addEventListener("click", function () {
  assignActive(this);
  createHome(1);
  searchInput.value = "";
});
popularBtn.addEventListener("click", function () {
  assignActive(this);
  createPopular("Movies", 1);
  searchInput.value = "";
});
topRatedBtn.addEventListener("click", function () {
  assignActive(this);
  createTopRated("Movies", 1);
  searchInput.value = "";
});
upcomingBtn.addEventListener("click", function () {
  assignActive(this);
  createUpcoming(1);
  searchInput.value = "";
});

let executeSearch = null;
searchInput.addEventListener("keyup", function (e) {
  clearTimeout(executeSearch);

  executeSearch = setTimeout(() => {
    if (e.target.value === "") {
      assignActive(homeBtn);
      createHome(1);
    } else {
      createSearchResults("Movies", e.target.value, 1);
    }
  }, 1000);
});

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

// ASSIGN ACTIVE CLASS ----------------------------------------------

function assignActive(element) {
  const array = [
    "menu-link-home",
    "menu-link-popular",
    "menu-link-toprated",
    "menu-link-upcoming",
  ];
  array.forEach((item) => {
    if (item === element.className) {
      element.parentElement.classList.add("active");
    } else {
      document
        .querySelector(`.${item}`)
        .parentElement.classList.remove("active");
    }
  });
}

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
    `https://api.themoviedb.org/3/${endpoint}`,
    options
  );
  const data = await response.json();

  hideSpinner();

  return data;
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

// CREATE HOME PAGE -----------------------------------------------

function createHome(page) {
  clearContainer();
  setupGrid("4");
  createSwiper();
  createCategory("Top 5 Movies", 5, "movie/popular?language=en-US", page);
  createCategory("Top 5 Shows", 5, "tv/popular?language=en-US", page);
  createFooter();
  loadFavourites();
}

createHome(1);

// CREATE POPULAR PAGE ---------------------------------------------

function createPopular(media, page) {
  if (media === "Movies") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createPopular, false);
    createCategory("Popular Movies", 20, "movie/popular?language=en-US", page);
    createPagination("movie/popular?language=en-US", page);
    createFooter();
    loadFavourites();
  }
  if (media === "TV Shows") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createPopular, false);
    createCategory("Popular TV Shows", 20, "tv/popular?language=en-US", page);
    createPagination("tv/popular?language=en-US", page);
    createFooter();
    loadFavourites();
  }
}

// CREATE TOP RATED PAGE -------------------------------------------

function createTopRated(media, page) {
  if (media === "Movies") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createTopRated, false);
    createCategory(
      "Top Rated Movies",
      20,
      "movie/top_rated?language=en-US",
      page
    );
    createPagination("movie/top_rated?language=en-US", page);
    createFooter();
    loadFavourites();
  }
  if (media === "TV Shows") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createTopRated, false);
    createCategory(
      "Top Rated TV Shows",
      20,
      "tv/top_rated?language=en-US",
      page
    );
    createPagination("tv/top_rated?language=en-US", page);
    createFooter();
    loadFavourites();
  }
}

// CREATE UPCOMING PAGE --------------------------------------------

function createUpcoming(page) {
  clearContainer();
  setupGrid("3");
  createCategory("Upcoming Movies", 20, "movie/upcoming?language=en-US", page);
  createPagination("movie/upcoming?language=en-US", page);
  createFooter();
  loadFavourites();
}

// CREATE SEARCH RESULTS --------------------------------------------

function createSearchResults(media, searchQuery, page) {
  if (media === "Movies") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createSearchResults, true);
    createCategory(
      `Search results for ${searchQuery}`,
      20,
      `search/movie?query=${searchQuery}`,
      page
    );
    createPagination(`search/movie?query=${searchQuery}`, page);
    createFooter();
    assignActive("none");
    loadFavourites();
  }
  if (media === "TV Shows") {
    clearContainer();
    setupGrid("4");
    createDropdown(media, createSearchResults, true);
    createCategory(
      `Search results for ${searchQuery}`,
      20,
      `search/tv?query=${searchQuery}`,
      page
    );
    createPagination(`search/tv?query=${searchQuery}`, page);
    createFooter();
    assignActive("none");
    loadFavourites();
  }
}

// SETUP GRID -----------------------------------------------------

function setupGrid(number) {
  mainContent.style.display = "grid";
  mainContent.style.gridTemplateColumns = "1fr";
  mainContent.style.gridTemplateRows = `repeat(${number}, auto)`;
}

// CREATE SWIPER --------------------------------------------------

async function createSwiper() {
  const response = await getApiData("movie/now_playing");
  const data = response.results;

  const swiper = document.createElement("div");
  swiper.classList.add("swiper");

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  data.forEach((movie) => {
    const swiperSlide = document.createElement("div");
    swiperSlide.classList.add("swiper-slide");

    const item = document.createElement("div");
    item.classList.add("swiper-item");
    item.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    const title = document.createElement("h2");
    title.classList.add("swiper-item-title");
    title.textContent = movie.title;

    const description = document.createElement("p");
    description.classList.add("swiper-item-description");
    if (movie.overview.length > 400) {
      description.textContent = `${movie.overview.substring(0, 400)} ...`;
    } else {
      description.textContent = movie.overview;
    }

    const btn = document.createElement("button");
    btn.classList.add("swiper-item-btn");
    btn.setAttribute("data-id", movie.id);
    btn.textContent = "More Info";
    btn.addEventListener("click", function () {
      clearContainer();
      setupGrid("2");
      createDetails(`movie/${this.dataset.id}`);
      createFooter();
    });

    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(btn);
    swiperSlide.appendChild(item);
    swiperWrapper.appendChild(swiperSlide);
  });

  swiper.appendChild(swiperWrapper);
  mainContent.appendChild(swiper);

  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "fade",
    loop: true,
    autoplay: {
      delay: 6000,
    },
  });
}

// CREATE DROPDOWN BOX -----------------------------------------------

function createDropdown(media, myFunction, boolean) {
  const div = document.createElement("div");
  div.classList.add("dropdown");

  const form = document.createElement("form");
  form.addEventListener("change", function (e) {
    if (boolean === false) {
      myFunction(e.target.value, 1);
    }
    if (boolean === true) {
      createSearchResults(e.target.value, searchInput.value, 1);
    }
  });

  const label = document.createElement("label");
  label.classList.add("dropdown-label");
  label.textContent = "Category:";

  const select = document.createElement("select");
  select.classList.add("dropdown-select");

  const option1 = document.createElement("option");
  option1.setAttribute("value", "Movies");
  option1.textContent = "Movies";

  const option2 = document.createElement("option");
  option2.setAttribute("value", "TV Shows");
  option2.textContent = "TV Shows";

  media === "Movies"
    ? option1.setAttribute("selected", "")
    : option2.setAttribute("selected", "");

  select.appendChild(option1);
  select.appendChild(option2);
  form.appendChild(label);
  form.appendChild(select);
  div.appendChild(form);
  mainContent.appendChild(div);
}

// CREATE PAGINATION -------------------------------------------------

const pageObject = async function (endpoint, page) {
  const response = await getApiData(`${endpoint}&page=${page}`);
  const state = {
    endPoint: endpoint,
    searchQuery: endpoint.slice(endpoint.indexOf("=") + 1),
    currentPage: page,
    totalPages: response.total_pages,
  };
  return state;
};

async function createPagination(endpoint, page) {
  const state = await pageObject(endpoint, page);

  const div = document.createElement("div");
  div.classList.add("pagination");

  const btnPrevious = document.createElement("button");
  btnPrevious.classList.add("pagination-btn");
  btnPrevious.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
  btnPrevious.addEventListener("click", function () {
    if (state.currentPage === 1) {
      return;
    } else if (state.endPoint === "movie/popular?language=en-US") {
      createPopular("Movies", state.currentPage - 1);
    } else if (state.endPoint === "tv/popular?language=en-US") {
      createPopular("TV Shows", state.currentPage - 1);
    } else if (state.endPoint === "movie/top_rated?language=en-US") {
      createTopRated("Movies", state.currentPage - 1);
    } else if (state.endPoint === "tv/top_rated?language=en-US") {
      createTopRated("TV Shows", state.currentPage - 1);
    } else if (state.endPoint === "movie/upcoming?language=en-US") {
      createUpcoming(state.currentPage - 1);
    } else if (state.endPoint.slice(7, 9) === "mo") {
      createSearchResults("Movies", state.searchQuery, state.currentPage - 1);
    } else if (state.endPoint.slice(7, 9) === "tv") {
      createSearchResults("TV Shows", state.searchQuery, state.currentPage - 1);
    }
  });

  const btnNext = document.createElement("button");
  btnNext.classList.add("pagination-btn");
  btnNext.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
  btnNext.addEventListener("click", function () {
    if (state.currentPage === state.totalPages) {
      return;
    } else if (state.endPoint === "movie/popular?language=en-US") {
      createPopular("Movies", state.currentPage + 1);
    } else if (state.endPoint === "tv/popular?language=en-US") {
      createPopular("TV Shows", state.currentPage + 1);
    } else if (state.endPoint === "movie/top_rated?language=en-US") {
      createTopRated("Movies", state.currentPage + 1);
    } else if (state.endPoint === "tv/top_rated?language=en-US") {
      createTopRated("TV Shows", state.currentPage + 1);
    } else if (state.endPoint === "movie/upcoming?language=en-US") {
      createUpcoming(state.currentPage + 1);
    } else if (state.endPoint.slice(7, 9) === "mo") {
      createSearchResults("Movies", state.searchQuery, state.currentPage + 1);
    } else if (state.endPoint.slice(7, 9) === "tv") {
      createSearchResults("TV Shows", state.searchQuery, state.currentPage + 1);
    }
  });

  const pageText = document.createElement("p");
  pageText.classList.add("pagination-text");
  pageText.innerHTML = `
    <span>${state.currentPage}</span> of ${state.totalPages}
  `;

  div.appendChild(btnPrevious);
  div.appendChild(pageText);
  div.appendChild(btnNext);
  mainContent.appendChild(div);
}

// CREATE CATEGORY CONTAINER -----------------------------------------

async function createCategory(title, amount, endpoint, page) {
  try {
    const div = document.createElement("div");
    div.classList.add("category");

    const divTitle = document.createElement("h3");
    divTitle.classList.add("category-title");
    divTitle.textContent = title;

    div.appendChild(divTitle);

    const cards = await createCards(amount, endpoint, page);
    div.appendChild(cards);

    mainContent.appendChild(div);
  } catch (error) {
    console.log(error);

    const paragraph = document.createElement("p");
    paragraph.classList.add("error-paragraph");
    paragraph.textContent = "There is nothing here, please try again.";

    mainContent.appendChild(paragraph);
  }
}

// CREATE CARDS -----------------------------------------------------

async function createCards(amount, endpoint, page) {
  try {
    const response = await getApiData(`${endpoint}&page=${page}`);
    const data = response.results;

    const div = document.createElement("div");
    div.classList.add("card-container");

    for (i = 0; i < amount; i++) {
      const card = document.createElement("div");
      card.classList.add("card");

      const link = document.createElement("a");
      link.setAttribute("data-id", data[i].id);
      link.setAttribute("data-type", data[i].title ? "movie" : "tv");
      link.addEventListener("click", function () {
        clearContainer();
        setupGrid("2");
        if (this.dataset.type === "movie") {
          createDetails(`movie/${this.dataset.id}`);
        }
        if (this.dataset.type === "tv") {
          createDetails(`tv/${this.dataset.id}`);
        }
        createFooter();
      });

      const img = document.createElement("img");
      img.classList.add("card-img");
      if (data[i].poster_path === null) {
        img.setAttribute("src", "./img/no-image.png");
      } else {
        img.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/original${data[i].poster_path}`
        );
      }

      link.appendChild(img);
      card.appendChild(link);
      div.appendChild(card);
    }

    return div;
  } catch (error) {
    console.log(error);
  }
}

// CREATE DETAILS PAGE ----------------------------------------------

async function createDetails(endpoint) {
  const data = await getApiData(endpoint);

  const details = document.createElement("div");
  details.classList.add("details");
  details.style.backgroundImage = `linear-gradient(to bottom, transparent, rgba(31, 32, 41)), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

  if (data.title) {
    const title = document.createElement("h2");
    title.classList.add("details-title");
    title.textContent = data.title;

    const description = document.createElement("p");
    description.classList.add("details-description");
    description.textContent = data.overview;

    const btn = document.createElement("button");
    btn.classList.add("details-btn");
    btn.setAttribute("data-id", data.id);
    btn.setAttribute("data-type", "movie");
    btn.textContent = "Add to Favourites";
    btn.addEventListener("click", function () {
      saveFavourite(`movie/${this.dataset.id}`);
    });

    const stars = document.createElement("p");
    stars.classList.add("details-stars");
    stars.innerHTML = `<i class="fa-solid fa-star"></i> ${Number.parseFloat(
      data.vote_average
    ).toFixed(1)} / 10`;

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("details-release");
    const date = new Date(data.release_date);
    releaseDate.innerHTML = `<strong>Release Date:</strong> ${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;

    const runtime = document.createElement("p");
    runtime.innerHTML = `<strong>Runtime:</strong> ${
      data.runtime.length > 0 ? data.runtime + " minutes" : "No Data"
    }`;

    const genres = document.createElement("p");
    const genreText = [];
    data.genres.forEach((genre) => genreText.push(genre.name));
    genres.innerHTML = `<strong>Genres:</strong> ${genreText.join(", ")}`;

    const originalLanguage = document.createElement("p");
    originalLanguage.innerHTML = `<strong>Original Language:</strong> ${data.original_language.toUpperCase()}`;

    details.appendChild(title);
    details.appendChild(description);
    details.appendChild(btn);
    details.appendChild(stars);
    details.appendChild(releaseDate);
    details.appendChild(runtime);
    details.appendChild(genres);
    details.appendChild(originalLanguage);
    mainContent.appendChild(details);
  }
  if (data.name) {
    const title = document.createElement("h2");
    title.classList.add("details-title");
    title.textContent = data.name;

    const description = document.createElement("p");
    description.classList.add("details-description");
    description.textContent = data.overview;

    const btn = document.createElement("button");
    btn.classList.add("details-btn");
    btn.setAttribute("data-id", data.id);
    btn.setAttribute("data-type", "tv");
    btn.textContent = "Add to Favourites";
    btn.addEventListener("click", function () {
      saveFavourite(`tv/${this.dataset.id}`);
    });

    const stars = document.createElement("p");
    stars.classList.add("details-stars");
    stars.innerHTML = `<i class="fa-solid fa-star"></i> ${Number.parseFloat(
      data.vote_average
    ).toFixed(1)} / 10`;

    const lastAirDate = document.createElement("p");
    const lastDate = new Date(data.last_air_date);
    lastAirDate.innerHTML = `<strong>Latest Air Date:</strong> ${lastDate.getDate()} ${
      months[lastDate.getMonth()]
    } ${lastDate.getFullYear()}`;

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("details-release");
    const firstDate = new Date(data.first_air_date);
    releaseDate.innerHTML = `<strong>Release Date:</strong> ${firstDate.getDate()} ${
      months[firstDate.getMonth()]
    } ${firstDate.getFullYear()}`;

    const runtime = document.createElement("p");
    runtime.innerHTML = `<strong>Runtime:</strong> ${
      data.episode_run_time.length > 0
        ? data.episode_run_time + " minutes"
        : "No Data"
    }`;

    const genres = document.createElement("p");
    const genreText = [];
    data.genres.forEach((genre) => genreText.push(genre.name));
    genres.innerHTML = `<strong>Genres:</strong> ${genreText.join(", ")}`;

    const episodes = document.createElement("p");
    episodes.innerHTML = `<strong>Episodes:</strong> ${data.number_of_episodes}`;

    const seasons = document.createElement("p");
    seasons.innerHTML = `<strong>Seasons:</strong> ${data.number_of_seasons}`;

    const originalLanguage = document.createElement("p");
    originalLanguage.innerHTML = `<strong>Original Language:</strong> ${data.original_language.toUpperCase()}`;

    details.appendChild(title);
    details.appendChild(description);
    details.appendChild(btn);
    details.appendChild(stars);
    details.appendChild(lastAirDate);
    details.appendChild(releaseDate);
    details.appendChild(runtime);
    details.appendChild(genres);
    details.appendChild(episodes);
    details.appendChild(seasons);
    details.appendChild(originalLanguage);
    mainContent.appendChild(details);
  }
}

// SAVE FAVOURITES TO LOCAL -----------------------------------------

async function saveFavourite(endpoint) {
  const data = await getApiData(endpoint);

  console.log(data);

  const favObject = {
    id: data.id,
    title: data.title ? data.title : data.name,
    image: data.backdrop_path,
  };

  const LOCAL = localStorage.getItem("myFavourites")
    ? JSON.parse(localStorage.getItem("myFavourites"))
    : [];

  duplicateCheck = (item) => item.id === favObject.id;

  if (LOCAL.length === 0 || LOCAL.some(duplicateCheck) === false) {
    LOCAL.push(favObject);
    localStorage.setItem("myFavourites", JSON.stringify(LOCAL));
    loadFavourites();
  } else {
    console.log("You already have this in your favourites");
    console.log(LOCAL);
  }
}

// CREATE FAVOURITES ------------------------------------------------

function createFavourite(id, image, title) {
  const favItem = document.createElement("li");
  favItem.classList.add("fav-item");
  favItem.setAttribute("data-id", id);

  const favIMG = document.createElement("img");
  favIMG.classList.add("fav-img");
  favIMG.setAttribute("src", `https://image.tmdb.org/t/p/original${image}`);

  const favText = document.createElement("p");
  favText.classList.add("fav-item-text");
  favText.textContent = title;

  favItem.appendChild(favIMG);
  favItem.appendChild(favText);
  favouriteList.appendChild(favItem);
}

// LOAD FAVOURITES --------------------------------------------------

function loadFavourites() {
  favouriteList.innerHTML = "";

  const favs = localStorage.getItem("myFavourites")
    ? JSON.parse(localStorage.getItem("myFavourites"))
    : [];

  if (favs.length === 0) {
    favouriteList.innerHTML = "";
  } else {
    favs.forEach((item) => {
      createFavourite(item.id, item.image, item.title);
    });
  }
}

// CREATE FOOTER AT BOTTOM OF THE PAGE ------------------------------

function createFooter() {
  const footer = document.createElement("footer");
  footer.classList.add("footer");

  const p1 = document.createElement("p");
  p1.textContent = "Design inspiration from Dribbble by Anton Tkachev ";

  const linkDribbble = document.createElement("a");
  linkDribbble.textContent = "Unity Gaming I";
  linkDribbble.setAttribute(
    "href",
    "https://dribbble.com/shots/14392022-Unity-Gaming-I?utm_source=pinterest&utm_campaign=pinterest_shot&utm_content=Unity+Gaming+I&utm_medium=Social_Share"
  );

  const p2 = document.createElement("p");
  p2.textContent = "API used for this project ";

  const linkAPI = document.createElement("a");
  linkAPI.textContent = "TMDB - The Movie DataBase";
  linkAPI.setAttribute(
    "href",
    "https://developer.themoviedb.org/docs/getting-started"
  );

  const apiIMG = document.createElement("img");
  apiIMG.setAttribute("src", "./img/blue_long.svg");
  apiIMG.setAttribute("alt", "the movie database api logo");

  p1.appendChild(linkDribbble);
  p2.appendChild(linkAPI);
  footer.appendChild(p1);
  footer.appendChild(p2);
  footer.appendChild(apiIMG);
  mainContent.appendChild(footer);
}

// CLEAR CONTAINER ------------------------------------------------

function clearContainer() {
  while (mainContent.hasChildNodes()) {
    mainContent.removeChild(mainContent.firstChild);
  }
}
