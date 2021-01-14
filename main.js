// singleton
const AllNominations = new Nominations();

window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const spinner = document.getElementById('resultsWaitingSpinner');
    const nominationsCompleteModalButton = document.getElementById('nominationsCompleteModalCloseButton');
    const saveNominationToLocalStorageButton = document.getElementById('saveNominationToLocalStorageButton');
    const restartBtn = document.getElementById('restartBtn');

    restartBtn.addEventListener('click', () => window.location.href = window.location.origin);
    
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