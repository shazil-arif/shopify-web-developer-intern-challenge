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
    movieSeachNameInput.addEventListener('keyup', () => alertField.hide());

    // even to fire on search button click
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