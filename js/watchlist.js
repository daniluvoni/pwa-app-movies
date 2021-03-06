const showMyList = document.getElementById("my-list");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

next.style.display = 'none';
prev.style.display = 'none';
const result = document.getElementById("result");
const noResult = document.getElementById("noResults");
noResult.style.display = 'none';

function showMoviesDataFromLocalStorage() {
    showEmptyMoviesLabel();
    let movies = getMoviesFromLocalstorage();
    fetchAndShowAllMovies(movies, showMyList, 'removeMovieAndRefreshPage');
}

function removeMovieAndRefreshPage(movieId){
    removeMovieFromWatchlist(movieId);
    location.reload();
}

function showEmptyMoviesLabel() {    
    let movies = getMoviesFromLocalstorage();
    if (movies.length == 0){
         noResult.style.display='block';
     }   
 }