HTMLElement.prototype.inputIsEmpty = function(){
    return this.value.trim().length === 0;
}
HTMLElement.prototype.hide = function(){
    this.style.display = 'none';
}
HTMLElement.prototype.show = function(){
    this.style.display = 'block'
}

function Movie(Title, Year, imdbID){
    this.Title = Title
    this.Year = Year;
    this.imdbId = imdbID;
}

function Nominations(){
    this.movies = {};
    this.size = 0;
}

Nominations.prototype.add = function(movie){
    this.movies[movie.imdbID] = movie;
    this.size++;
}
Nominations.prototype.remove = function(imdbID){
    this.movies[imdbID] = null; // help with Garbage collection?
    delete this.movies[imdbID];
    this.size--;
}
Nominations.prototype.count = function(){
    return this.size;
}

// singleton
const AllNominations = new Nominations();

// http://www.omdbapi.com/?s=MOVIENAME&apikey=fdf22c9a
async function fetchMovieFromAPI(movieTitle){
    const apikey = 'fdf22c9a';
    const titleQueryParameter = `s=${movieTitle}`;
    const apiKeyQueryParameter = `apiKey=${apikey}`
    const URL = `http://www.omdbapi.com/?${titleQueryParameter}&${apiKeyQueryParameter}`;
    let data = await fetch(URL)
    data = await data.json();
    return data.Search;    
}

function listMovies(movies){
    const searchResultsList = document.getElementById('searchResultsList');
    searchResultsList.innerHTML = ''; // remove previous movie results, not working atm

    const idLookup = {};

    for(const movie of movies){
        /**
         * movie Schema{
         * Title:
         * Year
         * imdbID
         * Poster
         * }
         */

        idLookup[movie.imdbID] = new Movie(movie.Title, movie.Year, movie.imdbID);

        searchResultsList.insertAdjacentHTML('afterbegin', 
        `
        <li>
        ${movie.Title} (${movie.Year}) 
        <button type="button" id = "${movie.imdbID}-add" class="btn btn-primary"><i class="fas fa-search"></i> Nominate</button>
        </li>`)

        let btn = document.getElementById(`${movie.imdbID}-add`);
        btn.addEventListener("click", () => {
            let movieToNominate = idLookup[movie.imdbID];
            


            AllNominations.add(movieToNominate);
            
            if(AllNominations.count() === 5) {
                document.getElementById('nominationsCompleteNotice').show();
            }

            const nominatedMovieList = document.getElementById('nominatedMovieList');
            nominatedMovieList.innerHTML = '';
            nominatedMovieList.show();

            nominatedMovieList.insertAdjacentHTML('afterbegin', `<li id="${movie.imdbID}" >${movie.Title} (${movie.Year}) </li> 
            <button type="button" id = "${movie.imdbID}-remove" class="btn btn-primary"><i class="fas fa-trash"></i> Remove</button>
            `);
            btn.disabled = true;

            let removeNominationBtn = document.getElementById(`${movie.imdbID}-remove`);
            removeNominationBtn.addEventListener('click', () => {
                AllNominations.remove(movie.imdbID);
                nominatedMovieList.removeChild(document.getElementById(`${movie.imdbID}`));
                nominatedMovieList.removeChild(document.getElementById(`${movie.imdbID}-remove`));

            })
        });
    }
}

window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const spinner = document.getElementById('resultsWaitingSpinner');
    const modalCloseButton = document.getElementById('modalCloseButton');
    modalCloseButton.addEventListener('click', () => document.getElementById('nominationsCompleteNotice').hide())

    // this is so that we can hide the alert message incase it was previously shown
    // todo: add debounce
    movieSeachNameInput.addEventListener('keyup', () => {
        alertField.hide();
    });

    // even to fire on search button click
    // TODO: add debounce
    // TODO: keep performance (Big O, javascript tweaks, caching links and api requests etc), browser compatability and memory usage in mind
    searchBtn.addEventListener('click', async () => {
        // show alert message if movie title name was not given
        if(movieSeachNameInput.inputIsEmpty()){
            alertField.show();
        }
        else{
            // show spinner
            spinner.show();
            const movieTitle = movieSeachNameInput.value;
            const movieTitleSearchResults = await fetchMovieFromAPI(movieTitle);
            spinner.hide();
            searchResultsContainer.show();
            listMovies(movieTitleSearchResults);
        }
    });
}