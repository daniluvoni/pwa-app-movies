const apiKey = "c2b93e6";

function searchMovies(movieName) {

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

                fetchAndShowAllMovies(responseJson.Search.map(movieData => movieData.imdbID), moviesList, 'addMovieToWatchlist');

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

    let nameBtn = "";
    if (buttonAction == 'addMovieToWatchlist') {
        nameBtn = 'Add to Watchlist';
    }
    else {
        nameBtn = 'Remove';
    }

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
                                                <button id='btnAction' type="button" onclick='${buttonAction}("${movieData.imdbID}");'>${nameBtn}</button>
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
    let arrayMovies = getMoviesFromLocalstorage();
    arrayMovies.push(moveId);
    saveMoviesDataInStorage(arrayMovies);
}

function removeMovieFromWatchlist(movieId) {
    let arrayMovies = getMoviesFromLocalstorage();
    arrayMovies = arrayMovies.filter(id => id != movieId);
    saveMoviesDataInStorage(arrayMovies);
}