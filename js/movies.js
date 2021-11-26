const apiKey = "c2b93e6";
const btnInstall = document.getElementById('btnInstall');
const statusConnection = document.getElementById('status');

setInterval(function () {
    statusConnection.className = navigator.onLine ? 'online' : 'offline';
    statusConnection.innerHTML = navigator.onLine ? 'online' : 'offline';
}, 3000);

let initializeUI = function () {

    btnInstall.removeAttribute('hidden');
    btnInstall.addEventListener('click', function () {

        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {

            if (choice.outcome === 'accepted') {
                console.log("Instalación aceptada por el usuario");
            } else {
                console.log("El usuario no aceptó la instalación");
            }
        });
    });
}

window.addEventListener('beforeinstallprompt', saveEventInstallApp);

function saveEventInstallApp(event) {
    console.log("beforeinstallprompt Event fired");
    deferredInstallPrompt = event;
}

function searchMovies(movieName, buttonAction) {

    const urlSearch = `http://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}&type=movie&r=json&page=${currentPage}`;

    fetch(urlSearch)
        .then((response) => {

            result.style.display = "block";

            if (response.status === 200) {
                return response.json();
            } else {
                throw "Respuesta incorrecta del servidor";
            }
        })
        .then((responseJson) => {

            if (responseJson.Response == 'True') {

                let pageCount = responseJson.totalResults / 10;

                fetchAndShowAllMovies(responseJson.Search.map(movieData => movieData.imdbID), moviesList, buttonAction);

                if (currentPage > 1) {
                    prev.style.display = 'block';
                } else {
                    prev.style.display = 'none';
                }

                if (currentPage < pageCount) {
                    next.style.display = 'block';
                } else {
                    next.style.display = 'none';
                }
            }
            else {
                result.style.display = 'none';
                noResult.style.display = 'block';
            }
        })
        .catch(err => {

            console.log("catch", err);
            msg.textContent = "Ingrese una película válida";

        });
    msg.textContent = "";
    //form.reset();
    inputElement.focus();
}

function fetchAndShowAllMovies(moveIds, element, buttonAction) {

    moveIds.forEach(id => {
        fechtAndShowMovieDetail(id, element, buttonAction);
    });
}

function fechtAndShowMovieDetail(movieId, element, buttonAction) {

    const urlMovieData = `https://www.omdbapi.com/?i=${movieId}&plot=short&r=json&apikey=${apiKey}`;

    fetch(urlMovieData)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw "Respuesta incorrecta del servidor";
            }
        })
        .then((result) => {
            showMovieDetail(result, element, buttonAction);
        });
}

function showMovieDetail(movieData, element, buttonAction) {

    element.innerHTML += `<div>
                            <ul>
                                <li class="li-movie">
                                    <div class="row">
                                        <div class="col-lg-2">
                                            <picture>
                                                <source srcset="${movieData.Poster}" media="all and (min-width: 46.875em)">
                                                <img src="${movieData.Poster}" class="img-fluid" alt="${movieData.Title}">
                                            </picture>
                                        </div>
                                        <div class="col-lg-9">
                                            <div>
                                                <h3 class="title" id="movie-title">${movieData.Title} </h3>
                                            </div>
                                            <div>
                                                <p id="movie-plot">${movieData.Plot}</p>
                                            </div>

                                            <div class="row">
                                                <div class="col-lg-6 col-md-6">
                                                    <ul>
                                                        <li><strong>Duration: </strong>${movieData.Runtime}</li>
                                                        <li><strong>Release date: </strong>${movieData.Year}</li>
                                                        <li><strong>Genre: </strong>${movieData.Genre}</li>
                                                        <li><strong>Rated: </strong>${movieData.Rated}</li>                            
                                                    </ul>
                                                </div>

                                                <div class="col-lg-6 col-md-6">
                                                    <ul>
                                                        <li><strong>Director: </strong>${movieData.Director}</li>
                                                        <li><strong>IMDB Rating: </strong>${movieData.imdbRating}/10</li>                                
                                                        <li><strong>Score: </strong>${movieData.Metascore}</li>
                                                        <li><strong>Website: </strong>${movieData.Website}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div>                                              
                                                <button id=${doesTheMovieExistsInStorage(movieData.imdbID) ? 'btnRemove' : 'btnAdd'} type="button" onclick='${buttonAction}("${movieData.imdbID}");'>
                                                ${doesTheMovieExistsInStorage(movieData.imdbID) ? 'Remove' : 'Add to watchlist'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>`;
}

function getMoviesFromLocalstorage() {
    let movies = [];
    if (localStorage != undefined && localStorage.movies != undefined) {
        movies = JSON.parse(localStorage.movies);
    }
    return movies;
}

function saveMoviesDataInStorage(result) {
    localStorage.setItem("movies", JSON.stringify(result));
}

function addMovieToWatchlist(moveId) {
    if (doesTheMovieExistsInStorage(moveId)) return;
    let arrayMovies = getMoviesFromLocalstorage();
    arrayMovies.push(moveId);
    saveMoviesDataInStorage(arrayMovies);
}

function doesTheMovieExistsInStorage(movieId) {
    let movies = getMoviesFromLocalstorage();
    for (let index = 0; index < movies.length; index++) {
        if (movieId == movies[index]) {
            return true;
        }
    }
    return false;
}

function removeMovieFromWatchlist(movieId) {
    let arrayMovies = getMoviesFromLocalstorage();
    arrayMovies = arrayMovies.filter(id => id != movieId);
    saveMoviesDataInStorage(arrayMovies);
}