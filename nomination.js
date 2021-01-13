const theShoppiesStorageId = 'the-shoppies-nominations';
const theShoppiesSavedEntryId = 'shoppies-'
const maxNominations = 5;
const movieResultsPerRow = 2;

// utilities
HTMLElement.prototype.inputIsEmpty = function(){
    return this.value.trim().length === 0;
}
HTMLElement.prototype.hide = function(){
    this.style.display = 'none';
}
HTMLElement.prototype.show = function(){
    this.style.display = 'block'
}

HTMLButtonElement.prototype.enable = function(){
    this.disabled = false;
}

HTMLButtonElement.prototype.disable = function(){
    this.disabled = true;
}


function Movie(Title, Year, imdbId, Poster){
    this.Title = Title;
    this.Year = Year;
    this.imdbID = imdbId;
    this.uniqueIdentifier = this.Title + '-' + this.Year + '-' + this.imdbID;
    this.Poster = Poster;
}
Movie.prototype.saveToLocalStorage = function(){
    localStorage.setItem(theShoppiesStorageId, true); // this is to check if some nominations were previously saved

    // the shoppies string prefix is so we can identify which local storage items to select
    localStorage.setItem(theShoppiesSavedEntryId + this.imdbID, this.uniqueIdentifier);
}

Movie.prototype.displayAsSearchResult = function(searchResultNumber){

    const searchResultsContainer = document.getElementById('searchResultsContainer');

    const template = document.getElementById('cardViewComponent');
    let node = document.importNode(template.content, true);
    
    let image = node.getElementById('moviePoster');
    let details = node.getElementById('movieTitleAndYearInfo');
    let nominateBtn = node.querySelector('a');

    image.setAttribute('src', this.Poster);
    details.innerText = `${this.Title} (${this.Year})`;
    nominateBtn.setAttribute('id', `${this.imdbID}-add`);

    this.bindNominationButton()

    let rowNumber = Math.floor(searchResultNumber/movieResultsPerRow);
    searchResultsContainer.children[rowNumber].appendChild(node);

}

Movie.prototype.bindNominationButton = function(){
    let nominationBtn = document.getElementById(`${this.imdbID}-add`);
    nominationBtn.addEventListener("click", () => {
        listMovieNomination(movie)
        btn.disable(); // disable once this movie has been nominated
    });
}

Movie.prototype.displayAsNomination = function(){
    
    AllNominations.add(new Movie(this.Title,  this.Year, this.imdbID, this.Poster));
            
    if(AllNominations.count() >= maxNominations) {
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

Movie.prototype.bindRemoveNominationButton = function(){
    
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
Nominations.prototype.getMovies = function (){
    let nominations = [];
    for(const key in this.movies){
        nominations.push(this.movies[key]);
    }
    return nominations;
}

function userIsVisitingWithShareableLink(){
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

        const movie = new Movie(movieTitle, movieYear,  movieimdbID, '');

        listMovieNomination(movie);
    }
}


function createShareableLink(){
    let queryString = '?';

    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    for(const Nomination of AllNominations.getMovies()){
        let queryParameter = Nomination.uniqueIdentifier;
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
  
    for(let i = 0; i < movies.length; i++){
        if(currentRowIsFull(i)){
            insertNewRow();
        }
        
        const currentMovie = new Movie(movies[i].Title, movies[i].Year, movies[i].imdbID, movies[i].Poster);
        currentMovie.displayAsSearchResult(i);

    }
}

function currentRowIsFull(){
    return count % movieResultsPerRow === 0;
}

function insertNewRow(){
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const row = document.getElementById('cardViewRowComponent');
    let rowComponent = document.importNode(row.content, true);
    searchResultsContainer.appendChild(rowComponent);
}

/**
 * @brief all this function needs is a movie object containing Title, Year and imdbID and will list it and handle any other intricacies
 * @param {Object} movie 
 */
function listMovieNomination(movie){

    AllNominations.add(new Movie(movie.Title,  movie.Year, movie.imdbID, movie.Poster));
            
    if(AllNominations.count() >= maxNominations) {
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

function previouslySavedNominationsExist(){
    if(localStorage.getItem(theShoppiesStorageId)) return true;
    return false;
}

function saveNominationToLocalStorage(){
    let spinner = document.getElementById('savingWaitSpinner');
    let onSavedSuccessBar = document.getElementById('onSavedSuccessBar');
    spinner.show();
    for(const Movie of AllNominations.getMovies()){
        Movie.saveToLocalStorage();
    }
    spinner.hide();
    onSavedSuccessBar.show();
}

function loadPreviousNominationsFromLocalStorage(){
    for(const key of Object.keys(localStorage)){ // NOTE: this MAY not work in some browsers
        if(key.startsWith(theShoppiesSavedEntryId)){
            let savedMovie = localStorage.getItem(key);

             // TODO: clean up
            const movieInfo = savedMovie.split('-');
            const movie = new Movie(movieInfo[0], movieInfo[1], movieInfo[2], '');
            AllNominations.add(movie);
            listMovieNomination(movie);
        }
    }
    
}

function deletePreviousNominationsInLocalStorage(){
    localStorage.removeItem(theShoppiesStorageId);
    for(const key of Object.keys(localStorage)){ // NOTE: this MAY not work in some browsers
        if(key.startsWith(theShoppiesSavedEntryId)){
            localStorage.removeItem(key);
        }
    }
}

function enableOriginalNominationButtonForMovie(movie){
    let originalButton = document.getElementById(`${movie.imdbID}-add`);
    // may or may not exist since users can visit using a shareable link
    if(originalButton) originalButton.enable();
}


window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const spinner = document.getElementById('resultsWaitingSpinner');
    const nominationsCompleteModalButton = document.getElementById('nominationsCompleteModalCloseButton');
    const saveNominationToLocalStorageButton = document.getElementById('saveNominationToLocalStorageButton');
    
    
    const loadFromStorageModal = document.getElementById('loadFromStorageModal');
    const loadFromStorageDismissButton = document.getElementById('loadFromStorageDismissButton');
    const loadFromStorageAcceptButton = document.getElementById('loadFromStorageAcceptButton');
    const deleteFromStorageButton = document.getElementById('deleteFromStorageButton');


    deleteFromStorageButton.addEventListener('click', () => {
        deletePreviousNominationsInLocalStorage();
        loadFromStorageModal.hide();
    });
    loadFromStorageDismissButton.addEventListener('click', () => loadFromStorageModal.hide());

    loadFromStorageAcceptButton.addEventListener('click', () => {
        loadPreviousNominationsFromLocalStorage();
        loadFromStorageModal.hide();
    });

    if(userIsVisitingWithShareableLink()){
        parseMovieTitlesFromQueryParameters();
    }

    // a design choice here is that if a user is visiting using a shareable link, they are likely not interested in their previously saved nominations
    if(previouslySavedNominationsExist() && !userIsVisitingWithShareableLink()) {
        loadFromStorageModal.show();
    }


    nominationsCompleteModalButton.addEventListener('click', () => document.getElementById('nominationsCompleteNotice').hide())

    saveNominationToLocalStorageButton.addEventListener('click', saveNominationToLocalStorage);

    // this is so that we can hide the alert message incase it was previously shown
    // todo: add debounce
    movieSeachNameInput.addEventListener('keyup', () => alertField.hide());

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