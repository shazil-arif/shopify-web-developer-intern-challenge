// unique identifiers to retrieve items from storage
const theShoppiesStorageId = 'the-shoppies-nominations';
const theShoppiesSavedEntryId = 'shoppies-'

/**
 * @function previouslySavedNominationsExist helper method to check if previously saved nominations exist
 */
function previouslySavedNominationsExist(){
    // can use the unique storage id defined at the top of the file
    // otherwise we'd have to look at all storage items and check if their key has the theShoppiesSavedEntryId prefix, which would waste a lot of time
    if(localStorage.getItem(theShoppiesStorageId)) return true;
    return false;
}

/**
 * @function saveNominationToLocalStorage saves all nominations to local storage for later use
 */
function saveNominationToLocalStorage(){
    let spinner = document.getElementById('savingWaitSpinner');
    let onSavedSuccessBar = document.getElementById('onSavedSuccessBar');

    spinner.show();
    for(const Movie of AllNominations.getMovies()){
        Movie.saveToLocalStorage();
    }
    spinner.hide();
    onSavedSuccessBar.show(); // show success
}

/**
 * @function loadPreviousNominationsFromLocalStorage
 */
function loadPreviousNominationsFromLocalStorage(){
    for(const key of Object.keys(localStorage)){ // NOTE: Object.keys may not work in some browsers
        if(key.startsWith(theShoppiesSavedEntryId)){
            let savedMovie = localStorage.getItem(key);

             // TODO: test this
            const movieInfo = JSON.parse(savedMovie);
            const movie = new Movie(movieInfo.Title, movieInfo.Year, movieInfo.imdbId, '');
            AllNominations.add(movie);
            movie.displayAsNomination();
        }
    }
    
}

/**
 * @function deletePreviousNominationsInLocalStorage clear nominations from local storage
 */
function deletePreviousNominationsInLocalStorage(){
    localStorage.removeItem(theShoppiesStorageId);
    for(const key of Object.keys(localStorage)){ // NOTE: Object.keys may not work in some older browsers
        if(key.startsWith(theShoppiesSavedEntryId)){ // if it starts with this prefix it belongs to the list of nominations saved by this page
            localStorage.removeItem(key);
        }
    }

    const onStorageClearedSuccessBar = document.getElementById('onStorageClearedSuccessBar');
    onStorageClearedSuccessBar.show();
}
