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
}

Nominations.prototype.add = function(movie){
    this.movies[movie.imdbID] = movie;
}
Nominations.prototype.remove = function(imdbID){
    this.movies[imdbID] = null; // help with Garbage collection?
    delete this.movies[imdbID];
}

// singleton
const AllNominations = new Nominations();

// &apikey=fdf22c9a
// http://www.omdbapi.com/?t=home&apikey=fdf22c9a
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
        console.log(movie);
        /**
         * movie Schema{
         * Title:
         * Year
         * imdbID
         * Poster
         * }
         */

        idLookup[movie.imdbID] = new Movie(movie.Title, movie.Year, imovie.imdbID);

        searchResultsList.insertAdjacentHTML('afterbegin', 
        `
        <li>
        ${movie.Title} (${movie.Year}) 
        <button type="button" id = "${movie.imdbID}" class="btn btn-primary"><i class="fas fa-search"></i> Nominate</button>
        </li>`)

        let btn = document.getElementById(`${movie.imdbID}`);
        btn.addEventListener("click", () => {
            let movieToNominate = idLookup[btn.id];
            
            console.log(AllNominations);
            AllNominations.add(movieToNominate);
            
            const nominatedMovieList = document.getElementById('nominatedMovieList');
            nominatedMovieList.show();
            nominatedMovieList.insertAdjacentHTML('afterbegin', `<li>${movie.Title} (${movie.Year}) </li>`);
            btn.disabled = true;
        });
    }
}

window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const spinner = document.getElementById('resultsWaitingSpinner');

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