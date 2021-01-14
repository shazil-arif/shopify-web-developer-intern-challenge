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

    
    const loadFromStorageModal = document.getElementById('loadFromStorageModal');
    const loadFromStorageDismissButton = document.getElementById('loadFromStorageDismissButton');
    const loadFromStorageAcceptButton = document.getElementById('loadFromStorageAcceptButton');
    const deleteFromStorageButton = document.getElementById('deleteFromStorageButton');


    // bunch of events binded to their corresponding buttons


    // check if user is visiting with a shareable link so we can populate the nomination list
    if(userIsVisitingWithShareableLink()){
        parseMovieTitlesFromQueryParameters(); // get and show the movie titles in the shareable link/query parameters
    }

    // check if user have previously saved nominations and if so ask them if they want to load them
    /**
     *  a design choice here is that if a user is visiting using a shareable link, they are likely not interested in their 
     * previously saved nominations hence we check if they are NOT visiting with some shareable link
     */
    if(previouslySavedNominationsExist() && !userIsVisitingWithShareableLink()) {
        loadFromStorageModal.show();
    }

    // to reload the page
    restartBtn.addEventListener('click', () => window.location.href = window.location.origin + '/shoppies.html');


    // if user wants to clear previous storage
    deleteFromStorageButton.addEventListener('click', () => {
        deletePreviousNominationsInLocalStorage();
    });

    // if user wants to dismiss their previous storage
    loadFromStorageDismissButton.addEventListener('click', () => loadFromStorageModal.hide());


    // if user wants to load previously stored nominations
    loadFromStorageAcceptButton.addEventListener('click', () => {
        loadPreviousNominationsFromLocalStorage();
        loadFromStorageModal.hide();
    });

    // when user has selected 5 nominations
    nominationsCompleteModalButton.addEventListener('click', () => document.getElementById('nominationsCompleteNotice').hide())

    // if user wants to save their nominations for next time
    saveNominationToLocalStorageButton.addEventListener('click', saveNominationToLocalStorage);

    // this is so that we can hide the alert message incase it was previously shown, problem: will continously fire
    movieSeachNameInput.addEventListener('keyup', () => alertField.hide());

    // even to fire on search button click
    searchBtn.addEventListener('click', async () => {
        // show alert message if movie title name was not given
        if(movieSeachNameInput.inputIsEmpty()){
            alertField.show();
        }
        else{
            // show spinner while waiting for API response
            spinner.show();

            // get search field inputs
            const movieTitle = movieSeachNameInput.value;
            const movieTitleSearchResults = await fetchMovieFromAPI(movieTitle);

            // stop showing spinner and display the results
            spinner.hide();
            searchResultsContainer.show();
            listMovieSarchResults(movieTitleSearchResults);
        }
    });
}