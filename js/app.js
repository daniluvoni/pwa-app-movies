const apiKey = "c2b93e6";

const form = document.getElementById("form-movie");
const button = document.getElementById("send-button");
const main = document.getElementById("main");
const inputElement = document.getElementById("search-input");
const moviesList = document.getElementById("movies-list");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const btnAdd = document.getElementById("btnAdd");

next.style.display = 'none';
prev.style.display = 'none';
const result = document.getElementById("result");
result.style.display = 'none';
const noResult = document.getElementById("noResults");
noResult.style.display = 'none';

const botaoInstalar = document.getElementById('btInstalar');

let initialiseUI = function () {

    botaoInstalar.removeAttribute('hidden');
    botaoInstalar.addEventListener('click', function () {

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

window.addEventListener('beforeinstallprompt', gravarEvento);

function gravarEvento(evt) {
    console.log("beforeinstallprompt Event fired");
    deferredInstallPrompt = evt;
}

button.addEventListener("click", () => {

    moviesList.innerHTML = "";
    searchMovies(inputElement.value);
});

let currentPage = 1;

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

                fetchAndShowAllMovies(responseJson.Search.map(movieData => movieData.imdbID));

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

function fetchAndShowAllMovies(moveIds) {

    moveIds.forEach(id => {
        fechtAndShowMovieDetail(id);

    });
}

function fechtAndShowMovieDetail(movieId) {

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

            showMovieDetail(result);

        });
}

function showMovieDetail(result) {

    moviesList.innerHTML += `<div> 
        <ul>
            <li>
                    <img id="movie-poster" src="${result.Poster}" alt="${result.Title}"> </li>
            
                    <p id="movie-title">${result.Title}</p>
                    <p id="movie-year">${result.Year}</p>
                    <p id="movie-plot"><strong>Plot: </strong>${result.Plot}</p>
                    <p id="movie-website"><strong>Website: </strong>${result.Website}</p>
                    <p><em>IMDB Rating: ${result.imdbRating} | Rotten Tomatoes Meter: ${result.tomatoMeter} | Metascore: ${result.Metascore}</em></p>
                    <button id='btnAdd' type="button" onclick='addToList("${result.imdbID}");'>Añadir a lista</button>
                
            </li>              
        </ul>
                                                            
    </div>`;
}

next.addEventListener('click', () => {

    moviesList.innerHTML = "";
    currentPage += 1;
    searchMovies(inputElement.value);

});

prev.addEventListener('click', () => {

    moviesList.innerHTML = "";
    currentPage -= 1;
    searchMovies(inputElement.value);

});

/* MI LISTA */
const myList=[];
function addToList(result) {
    
   // let myList=[];
    myList.push(result);   
    saveMoviesDataInStorage(myList);
    showMoviesDataFromLocalStorage(); 
 
}

function deletecOfList( result ){
    let this_btn=document.getElementsByClassName("btn btn-primary")[btn];
    //Eliminamos el elemento de la lista que no se quiere.
    document.getElementById( "my-list" ).removeChild( result );
    this_btn.innerHTML="añadir al carrito.";
            
    this_btn.onclick=function(){
        addToList(result);
    }
}

function saveMoviesDataInStorage(result) {

    localStorage.setItem("movies", JSON.stringify(result));
}

/**
 * Establece la sintáxis HTML del localStorage
 */
 function showMoviesDataFromLocalStorage() {
   
    if (localStorage != undefined && localStorage.movies != undefined) {
        
        let movies = JSON.parse(localStorage.movies);
        fetchAndShowAllMovies(movies);
        console.log("movies",movies);
    }
}

$(window).ready(function () {

    showMoviesDataFromLocalStorage();

});