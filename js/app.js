const apiKey = "c2b93e6";

const form = document.getElementById("form-movie");
const button = document.getElementById("send-button");
const main = document.getElementById("main");
const inputElement = document.getElementById("search-input");
const moviesList = document.getElementById("movies-list");
const links = document.getElementById("links");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

next.style.display = 'none';
prev.style.display = 'none';


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
    console.log("Movie: ", inputElement.value);
    moviesList.innerHTML = "";
    searchMovies(inputElement.value);
});

let currentPage = 1;

function searchMovies(movieName) {

    console.log("searchMovies", movieName);

    const url = `http://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}&type=movie&r=json&page=${currentPage}`;

    fetch(url)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw "Respuesta incorrecta del servidor";
            }
        })
        .then((result) => {
            console.log("searchMovies result:", result);
            showMovieData(result);
        })
        .catch(err => {
            console.log("catch", err);
            msg.textContent = "Ingrese una película válida";

        });
    msg.textContent = "";
    //form.reset();
    inputElement.focus();
}

function showMovieData(responseJson) {

    console.log("showMovieData");

    if (responseJson.Response == 'True') {

        let pageCount = responseJson.totalResults / 10;


        for (let index = 0; index < responseJson.Search.length; index++) {
            //const element = responseJson.Search[index];
            //console.log("element", element);

            moviesList.innerHTML += `<div> 
                                    <ul>
                                        <li><img src=${responseJson.Search[index].Poster}></li>
                                        <li>${responseJson.Search[index].Title} (${responseJson.Search[index].Year})</li>
                                        <li>Sinopsis: ${responseJson.Search[index].Plot}</li>
                                        
                                       
                                        
                                    </ul>                                                        
                                </div>`
        }

        if (currentPage > 1) {
            // TODO: show prev page button           
            prev.style.display = 'block';

        } else {
            prev.style.display = 'none';
        }

        console.log("showMovieData - pageCount:", pageCount);
        console.log("showMovieData - currentPage:", currentPage);
        if (currentPage < pageCount) {
            // TODO: show next page button  

            next.style.display = 'block';
        } else {
            next.style.display = 'none';
        }

    } else {
        console.log("vacio");
    }
    console.log("showMovieData - currentPageFinal:", currentPage);
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