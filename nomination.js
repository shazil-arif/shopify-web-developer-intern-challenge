const MAX_NOMINATIONS = 5;

HTMLElement.prototype.inputIsEmpty = function(){
    return this.value.trim().length === 0;
}
HTMLElement.prototype.hide = function(){
    this.style.display = 'none';
}
HTMLElement.prototype.show = function(){
    this.style.display = 'block'
}

function enableButton(HTMLButton){
    HTMLButton.disabled = false;
}

function disableButton(HTMLButton){
    HTMLButton.disabled = true;
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
Nominations.prototype.isEmpty = function (){
    return this.size === 0;
}
Nominations.prototype.getNominations = function (){
    let nominations = [];
    for(const key in this.movies){
        nominations.push(this.movies[key]);
    }
    return nominations;
}

function userIsVisitingViaShareableLink(){
    let queryString = window.location.search;
    return queryString.length > 0;
}

function parseMovieTitlesFromQueryParameters(){
    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    let queryParams = window.location.search.split('&');
    queryParams[0] = queryParams[0].replace('?', '');
    for(const queryParam of queryParams){

        const movieInfo = queryParam.split('-');

        const movieTitle = movieInfo[0];
        const movieYear = movieInfo[1];
        const movieimdbID = movieInfo[2];

        const movie = {Title: movieTitle, Year: movieYear, imdbId: movieimdbID};

        listMovieNomination(movie);
    }
}

function createShareableLink(){
    let queryString = '?';

    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    for(const Nomination of AllNominations.getNominations()){
        let queryParameter = `${Nomination.Title}-${Nomination.Year}-${Nomination.imdbID}`
        queryString += queryParameter;
        queryString += '&';
    }

    return window.location + queryString;
}

function displayShareableLink(){
    const shareableLink = createShareableLink();
    let shareableLinkAnchorTag = document.getElementById('shareableLinkAnchorTag');
    shareableLinkAnchorTag.setAttribute('href', shareableLink);
    shareableLinkAnchorTag.innerHTML = shareableLink;
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

function listMovieSarchResults(movies){
    const searchResultsList = document.getElementById('searchResultsList');
    searchResultsList.innerHTML = ''; // remove previous movie results, not working atm

    for(const movie of movies){
       
        searchResultsList.insertAdjacentHTML('afterbegin', 
        `
        <li>
        ${movie.Title} (${movie.Year}) 
        <button type="button" id = "${movie.imdbID}-add" class="btn btn-primary">Nominate</button>
        </li>`)

        let btn = document.getElementById(`${movie.imdbID}-add`);
        btn.addEventListener("click", () => {
            // let movieToNominate = idLookup[movie.imdbID];
            listMovieNomination(movie)
            disableButton(btn); // disable nomination button for this movie
            
        });
    }
}

/**
 * @brief all this function needs is a movie object containing Title, Year and imdbID and will list it and handle any other intricacies
 * @param {Object} movie 
 */
function listMovieNomination(movie){

    AllNominations.add({
        Title: movie.Title, 
        Year: movie.Year,
        imdbID: movie.imdbID
    });
            
    if(AllNominations.count() === MAX_NOMINATIONS) {
        document.getElementById('nominationsCompleteNotice').show();
        displayShareableLink();
    }
    else{
        const nominatedMovieList = document.getElementById('nominatedMovieList');
        const helpMessage = document.getElementById('helpMessage');

        helpMessage.hide();
        nominatedMovieList.show();
    
        nominatedMovieList.insertAdjacentHTML('afterbegin', `<li id="${movie.imdbID}" >${movie.Title} (${movie.Year}) </li> 
        <button type="button" id = "${movie.imdbID}-remove" class="btn btn-primary"><i class="fas fa-trash"></i> Remove</button>
        `);

        let removeNominationBtn = document.getElementById(`${movie.imdbID}-remove`);
        removeNominationBtn.addEventListener('click', () => {
            AllNominations.remove(movie.imdbID);
            nominatedMovieList.removeChild(document.getElementById(`${movie.imdbID}`)); // remove the title
            nominatedMovieList.removeChild(document.getElementById(`${movie.imdbID}-remove`)); // remove the titles REMOVE button

            enableOriginalNominationButtonForMovie(movie);

            if (AllNominations.isEmpty()) helpMessage.show();
        });
    }
}

function enableOriginalNominationButtonForMovie(movie){
    let originalButton = document.getElementById(`${movie.imdbID}-add`);
    // may or may not exist since users can visit using a shareable link
    if(originalButton) enableButton(originalButton);
}

function saveNominationToLocalStorage(){

}

window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const spinner = document.getElementById('resultsWaitingSpinner');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const saveNominationToLocalStorageButton = document.getElementById('saveNominationToLocalStorageButton');
    

    if(userIsVisitingViaShareableLink()){
        parseMovieTitlesFromQueryParameters();
    }

    modalCloseButton.addEventListener('click', () => document.getElementById('nominationsCompleteNotice').hide())

    saveNominationToLocalStorageButton.addEventListener('click', () => {
        // TODO, add to local storage
    })
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
            listMovieSarchResults(movieTitleSearchResults);
        }
    });
}