const maxNominations = 5; // adjustable constant, 5 for now

/**
 * Represents a book.
 * @constructor
 * @param {string} Title - The title of the book.
 * @param {string} Year - The author of the book.
 * @param {string} imdbId - the imdbId retrived from the omdb API
 * @param {string} Poster - a string containing a URL to an image of this movies poster
 */
function Movie(Title, Year, imdbId, Poster){
    this.Title = Title;
    this.Year = Year;
    this.imdbID = imdbId;
    this.uniqueIdentifier = this.Title + '-' + this.Year + '-' + this.imdbID; // this identifier can be used to save and retrieve from local storage and for forming unique query parameters for shareable links
    this.Poster = Poster;
}

/**
 * @function saveToLocalStorage saves a movie object to local storage using its unique identifer with encapulsates Title, Year and imdbId info
 */
Movie.prototype.saveToLocalStorage = function(){
    // theShoppiesStorageId is a unique id to check if nominations were previously saved
    localStorage.setItem(theShoppiesStorageId, true); // this is to check if some nominations were previously saved without iterating over all the storage items and checking their prefix for theShoppiesSavedEntryId

    // the shoppies string prefix is so we can identify which local storage items to select when retrieving items
    // localStorage.setItem(theShoppiesSavedEntryId + this.imdbID, this.uniqueIdentifier);
    localStorage.setItem(theShoppiesSavedEntryId + this.imdbID, JSON.stringify({
        Title: this.Title,
        Year: this.Year,
        imdbID: this.imdbID
    }) )
}


/**
 * @function displayAsSearchResult displays a movie object returned by the OMDB API as a result in a card view
 * @param {Number} searchResultNumber 0 based count representing the search result number of the movie object,
 * this can be used to calculate which row it will belong to since we show maximum of 3 per row
 */
Movie.prototype.displayAsSearchResult = function(searchResultNumber){

    const searchResultsContainer = document.getElementById('searchResultsContainer');

    // import and append to the document the resuable card view component
    const template = document.getElementById('cardViewComponent');
    let node = document.importNode(template.content, true);
    
    let image = node.getElementById('moviePoster');
    let details = node.getElementById('movieTitleAndYearInfo');
    let nominateBtn = node.querySelector('button');

    image.setAttribute('src', this.Poster);
    image.setAttribute('alt', 'Image Failed to Load, try again later')
    details.innerText = `${this.Title} (${this.Year})`;
    nominateBtn.setAttribute('id', `${this.imdbID}-add`); // give this button a unique id so we can identify it later


   

    // this works because searchResultsContainer is a div with other divs as its direct children
    /**
     *    div
     *    /  \
     *   /    \
     *  /      \
     * row0   row1
     * 
     * if row0 and row1 are child divs of the parent div we can calculate which row to put an entry in using a simple calculation
     * the row children can be accessed using searchResultsContainer.children and since it is an array we can simply index its
     */

    // can calculate which row a search result/ movie object belongs to by dividing it by movieResultsPerRow (3 in this case) and taking its floor
    let rowNumber = Math.floor(searchResultNumber/movieResultsPerRow);
    searchResultsContainer.children[rowNumber].appendChild(node); // append to the correct row

    this.bindNominationButton(); // add the event handler if a user decides to nominate this movie


}

/**
 * @function bindNominationButton binds a button to nominate a movie to a handler for when the user clicks it 
 */
Movie.prototype.bindNominationButton = function(){
    // get the nominatin button which can now be identified by its imdbId
    let nominationBtn = document.getElementById(`${this.imdbID}-add`);

    nominationBtn.addEventListener("click", () => {

        // check if 5 nominations already added
        if(AllNominations.count() >= maxNominations) {
            document.getElementById('nominationsCompleteNotice').show(); // show notice that nominations are complete
            displayShareableLink(); // provide user with a shareable link
        }
        else{
            // display 'this'/movie object as a nomination entry
            this.displayAsNomination();
            nominationBtn.disable(); // disable the button for this movie once it has been nominated
        }
    });
}

/**
 * @function displayAsNomination displays the current movie/ 'this' as a nomination entry
 */
Movie.prototype.displayAsNomination = function(){

    // collapse the nominations dropdown tab by modifying the UI's classlists
    const nominationsView = document.getElementById('nominationsView');
    const collapseTwo = document.getElementById('collapseTwo');
    nominationsView.classList.remove('collapsed');
    collapseTwo.classList.add('show');

    // add this nomination
    AllNominations.add(new Movie(this.Title,  this.Year, this.imdbID, this.Poster));
            
    const nominatedMovieList = document.getElementById('nominatedMovieList');
    const helpMessage = document.getElementById('helpMessage');

    // hide the existing 'helpMessage' the message the says 'Search for a movie above and then add a title to your nomination list'
    helpMessage.hide();
    nominatedMovieList.show();

    // import the reusable nominateMovieComponenet template
    const nominatedMovieComponent = document.getElementById('nominatedMovieComponent');
    const node = document.importNode(nominatedMovieComponent.content, true);

    const movieTitleAndYear = node.querySelector('li');
    const removeNominationButton = node.querySelector('a');


    // populate with the details of the movie
    movieTitleAndYear.setAttribute('id', this.imdbID);
    movieTitleAndYear.innerText = `${this.Title} (${this.Year})`

    // set a unique id for the remove nomination button
    removeNominationButton.setAttribute('id', `${this.imdbID}-remove`);

    // add the nomination entry to the document
    nominatedMovieList.appendChild(node);

    // bind the remove button to its handler to remove the nomination
    this.bindRemoveButton();

    // check if 5 nominations have been added
    // if user came from a shareable link, they would have 5 right away and the dialog would show
    // since the above would be slightly distracting in the UI, do not show the dialog even if user has 5 if they are coming from a shareable link
    if(AllNominations.count() >= maxNominations && !userIsVisitingWithShareableLink()) {
        document.getElementById('nominationsCompleteNotice').show();
        displayShareableLink();
    }

}

/**
 * @function bindRemoveButton binds the remove nomination button for the current movie/'this' to a handler for removing the nomination
 * 
 */
Movie.prototype.bindRemoveButton = function(){
    let removeNominationBtn = document.getElementById(`${this.imdbID}-remove`);

    removeNominationBtn.addEventListener('click', () => {

        AllNominations.remove(this.imdbID);
        nominatedMovieList.removeChild(document.getElementById(`${this.imdbID}`)); // remove the title
        nominatedMovieList.removeChild(document.getElementById(`${this.imdbID}-remove`)); // remove the titles REMOVE button

        // re enable the original nomination button for 'this' movie if user decides to remove it from the current nominations
        this.enableNominationButton();

        // if nominations list is empty, show the help message that says 'Search for a movie above and then add a title to your nomination list'
        if (AllNominations.isEmpty()) helpMessage.show();
    });
}


/**
 * @function enableNominationButton enables 'this' movies nomination button in the search results/card view UI
 */
Movie.prototype.enableNominationButton = function(){
    let nominationBtn = document.getElementById(`${this.imdbID}-add`);

    // may or may not exist since users can visit using a shareable link so check before doing so
    if(nominationBtn) nominationBtn.enable();
}