const theShoppiesStorageId = 'the-shoppies-nominations';
const theShoppiesSavedEntryId = 'shoppies-'

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
            movie.displayAsNomination();
            // listMovieNomination(movie);
        }
    }
    
}

function deletePreviousNominationsInLocalStorage(){
    localStorage.removeItem(theShoppiesStorageId);
    for(const key of Object.keys(localStorage)){ // NOTE: Object.keys may not work in some older browsers
        if(key.startsWith(theShoppiesSavedEntryId)){
            localStorage.removeItem(key);
        }
    }

    const onStorageClearedSuccessBar = document.getElementById('onStorageClearedSuccess');
    onStorageClearedSuccessBar.show();
}
