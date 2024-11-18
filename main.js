const mainContent = document.querySelector(".content");
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

async function getApiData(endpoint, page) {
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
    `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=${page}`,
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
  setupGrid("3");
  createSwiper();
  createCategory("Top 5 Movies");
  createFooter();
}

createHome();

// SETUP GRID -----------------------------------------------------

function setupGrid(number) {
  mainContent.style.display = "grid";
  mainContent.style.gridTemplateColumns = "1fr";
  mainContent.style.gridTemplateRows = `repeat(${number}, auto)`;
}

// CREATE SWIPER --------------------------------------------------

async function createSwiper() {
  const response = await getApiData("movie/now_playing", "1");
  const data = response.results;
  console.log(data);

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

    const desc = document.createElement("p");
    desc.classList.add("swiper-item-description");
    desc.textContent = movie.overview;

    const btn = document.createElement("button");
    btn.classList.add("swiper-item-btn");
    btn.setAttribute("data-id", movie.id);
    btn.textContent = "More Info";

    item.appendChild(title);
    item.appendChild(desc);
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

// CREATE SECTION CONTAINER -----------------------------------------

async function createCategory(title) {
  const div = document.createElement("div");
  div.classList.add("category");

  const divTitle = document.createElement("h3");
  divTitle.classList.add("category-title");
  divTitle.textContent = title;

  div.appendChild(divTitle);

  const cards = await createCards(5);
  console.log(cards);
  div.appendChild(cards);

  mainContent.appendChild(div);
}

// CREATE CARDS -----------------------------------------------------

async function createCards(amount) {
  const response = await getApiData("movie/popular", "1");
  const data = response.results;

  const div = document.createElement("div");
  div.classList.add("card-container");

  for (i = 0; i < amount; i++) {
    console.log(data[i]);

    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.classList.add("card-img");
    img.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/original${data[i].poster_path}`
    );

    card.appendChild(img);
    div.appendChild(card);
  }

  return div;
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
