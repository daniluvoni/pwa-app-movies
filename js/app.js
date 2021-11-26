const form = document.getElementById("form-movie");
const btnSearch = document.getElementById("send-button");
const main = document.getElementById("main");
const inputElement = document.getElementById("search-input");
const moviesList = document.getElementById("movies-list");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

next.style.display = 'none';
prev.style.display = 'none';
const result = document.getElementById("result");
result.style.display = 'none';
const noResult = document.getElementById("noResults");
noResult.style.display = 'none';

let currentPage = 1;

btnSearch.addEventListener("click", () => {
    moviesList.innerHTML = "";
    searchMovies(inputElement.value, 'bleh');
});

next.addEventListener('click', () => {
    moviesList.innerHTML = "";
    currentPage += 1;
    searchMovies(inputElement.value, 'bleh');
});

prev.addEventListener('click', () => {
    moviesList.innerHTML = "";
    currentPage -= 1;
    searchMovies(inputElement.value, 'bleh');
});

function bleh(moveId) {
    addMovieToWatchlist(moveId);
    // TODO: buscar el boton de la pelicula para cambiarle el id
}

$(document).ready(function(){
    $('.toast').toast('show');
  });