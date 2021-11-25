const showMyList = document.getElementById("my-list");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

next.style.display = 'none';
prev.style.display = 'none';
const result = document.getElementById("result");
const btnAdd = document.getElementById("btnAdd");
const noResult = document.getElementById("noResults");
noResult.style.display = 'none';

function showMoviesDataFromLocalStorage() {

    if (localStorage != undefined && localStorage.movies != undefined) {

        let movies = JSON.parse(localStorage.movies);
        fetchAndShowAllMovies(movies, showMyList);

    }
}