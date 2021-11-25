const form = document.getElementById("form-movie");
const btnSearch = document.getElementById("send-button");
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

let currentPage = 1;

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

btnSearch.addEventListener("click", () => {

    moviesList.innerHTML = "";
    searchMovies(inputElement.value);

});

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

