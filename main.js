const mainContent = document.querySelector(".content");
const homeBtn = document.querySelector(".menu-link-home");
const popularBtn = document.querySelector(".menu-link-popular");
const topRatedBtn = document.querySelector(".menu-link-toprated");
const upcomingBtn = document.querySelector(".menu-link-upcoming");

homeBtn.addEventListener("click", createHome);
popularBtn.addEventListener("click", function () {
  createPopular("Movies");
});
topRatedBtn.addEventListener("click", function () {
  createTopRated("Movies");
});
upcomingBtn.addEventListener("click", createUpcoming);

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

function createHome() {
  clearContainer();
  setupGrid("4");
  createSwiper();
  createCategory("Top 5 Movies", 5, "movie/popular");
  createCategory("Top 5 Shows", 5, "tv/popular");
  createFooter();
}

createHome();

// CREATE POPULAR PAGE ---------------------------------------------

function createPopular(e) {
  if (e === "Movies") {
    clearContainer();
    setupGrid("3");
    createDropdown(e, createPopular);
    createCategory("Popular Movies", 20, "movie/popular");
    createFooter();
  }
  if (e === "TV Shows") {
    clearContainer();
    setupGrid("3");
    createDropdown(e, createPopular);
    createCategory("Popular TV Shows", 20, "tv/popular");
    createFooter();
  }
}

// CREATE TOP RATED PAGE -------------------------------------------

function createTopRated(e) {
  if (e === "Movies") {
    clearContainer();
    setupGrid("3");
    createDropdown(e, createTopRated);
    createCategory("Top Rated Movies", 20, "movie/top_rated");
    createFooter();
  }
  if (e === "TV Shows") {
    clearContainer();
    setupGrid("3");
    createDropdown(e, createTopRated);
    createCategory("Top Rated TV Shows", 20, "tv/top_rated");
    createFooter();
  }
}

// CREATE uPCOMING PAGE --------------------------------------------

function createUpcoming() {
  clearContainer();
  setupGrid("2");
  createCategory("Upcoming Movies", 20, "movie/upcoming");
  createFooter();
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
    description.textContent = movie.overview;

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

function createDropdown(e, myFunction) {
  const div = document.createElement("div");
  div.classList.add("dropdown");

  const form = document.createElement("form");
  form.addEventListener("change", function (e) {
    myFunction(e.target.value);
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

  e === "Movies"
    ? option1.setAttribute("selected", "")
    : option2.setAttribute("selected", "");

  select.appendChild(option1);
  select.appendChild(option2);
  form.appendChild(label);
  form.appendChild(select);
  div.appendChild(form);
  mainContent.appendChild(div);
}

// CREATE CATEGORY CONTAINER -----------------------------------------

async function createCategory(title, amount, endpoint) {
  const div = document.createElement("div");
  div.classList.add("category");

  const divTitle = document.createElement("h3");
  divTitle.classList.add("category-title");
  divTitle.textContent = title;

  div.appendChild(divTitle);

  const cards = await createCards(amount, endpoint);
  div.appendChild(cards);

  mainContent.appendChild(div);
}

// CREATE CARDS -----------------------------------------------------

async function createCards(amount, endpoint) {
  const response = await getApiData(endpoint);
  const data = response.results;

  const div = document.createElement("div");
  div.classList.add("card-container");

  for (i = 0; i < amount; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    const link = document.createElement("a");
    link.setAttribute("data-id", data[i].id);
    link.addEventListener("click", function () {
      clearContainer();
      setupGrid("2");
      if (data[i].title) {
        createDetails(`movie/${this.dataset.id}`);
      }
      if (data[i].name) {
        createDetails(`tv/${this.dataset.id}`);
      }
      createFooter();
    });

    const img = document.createElement("img");
    img.classList.add("card-img");
    img.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/original${data[i].poster_path}`
    );

    link.appendChild(img);
    card.appendChild(link);
    div.appendChild(card);
  }

  return div;
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
    btn.textContent = "Add to Favourites";
    btn.addEventListener("click", function () {
      console.log("console favourites");
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
    btn.textContent = "Add to Favourites";
    btn.addEventListener("click", function () {
      console.log("console favourites");
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
