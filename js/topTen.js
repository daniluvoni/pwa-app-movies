const showTopTen = document.getElementById("top-ten");
const result = document.getElementById("result");
const btnAdd = document.getElementById("btnAdd");
const noResult = document.getElementById("noResults");
noResult.style.display = 'none';

function showMoviesRandomImdbID() {

    let arrayRandomImdbID = [];
    for (let index = 0; index <= 9; index++) {
        let movie = pad(Math.floor((Math.random() * 2155529) + 1), 7);
        let imdbID = "tt" + movie;
        arrayRandomImdbID.push(imdbID);
    }
    fetchAndShowAllMovies(arrayRandomImdbID, showTopTen, 'addMovieToWatchlist');
}

function pad(number, length) {

    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}