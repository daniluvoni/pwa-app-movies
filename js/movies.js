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

                fetchAndShowAllMovies(responseJson.Search.map(movieData => movieData.imdbID), moviesList);

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

function fetchAndShowAllMovies(moveIds, element) {

    moveIds.forEach(id => {
        fechtAndShowMovieDetail(id, element);

    });
}

function fechtAndShowMovieDetail(movieId, element) {

    const urlMovieData = `https://www.omdbapi.com/?i=${movieId}&plot=full&r=json&tomatoes=true&apikey=${apiKey}`;

    fetch(urlMovieData)
        .then((response) => {

            if (response.status === 200) {
                return response.json();
            } else {
                throw "Respuesta incorrecta del servidor";
            }

        })
        .then((result) => {

            showMovieDetail(result, element);

        });
}

function showMovieDetail(movieData, element) {

    element.innerHTML += `<div> 
        <ul>
            <li>
                    <img id="movie-poster" src="${movieData.Poster}" alt="${movieData.Title}"> </li>
            
                    <p id="movie-title">${movieData.Title}</p>
                    <p id="movie-year">${movieData.Year}</p>
                    <p id="movie-plot"><strong>Plot: </strong>${movieData.Plot}</p>
                    <p id="movie-website"><strong>Website: </strong>${movieData.Website}</p>
                    <p><em>IMDB Rating: ${movieData.imdbRating} | Rotten Tomatoes Meter: ${movieData.tomatoMeter} | Metascore: ${movieData.Metascore}</em></p>
                    <button id='btnAdd' type="button" onclick='addToList("${movieData.imdbID}");'>Añadir a lista</button>
                
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

$(window).ready(function () {

    showMoviesDataFromLocalStorage();

});