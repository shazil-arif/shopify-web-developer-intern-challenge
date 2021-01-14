const maxNominations = 5;

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
    let nominateBtn = node.querySelector('button');

    image.setAttribute('src', this.Poster);
    details.innerText = `${this.Title} (${this.Year})`;
    nominateBtn.setAttribute('id', `${this.imdbID}-add`);


    let rowNumber = Math.floor(searchResultNumber/movieResultsPerRow);
    searchResultsContainer.children[rowNumber].appendChild(node);

    this.bindNominationButton();


}

Movie.prototype.bindNominationButton = function(){
    let nominationBtn = document.getElementById(`${this.imdbID}-add`);
    nominationBtn.addEventListener("click", () => {
        // listMovieNomination(movie)
        if(AllNominations.count() >= maxNominations) {
            document.getElementById('nominationsCompleteNotice').show();
            displayShareableLink();
        }
        else{
            this.displayAsNomination();
            nominationBtn.disable(); // disable once this movie has been nominated
        }
    });
}

Movie.prototype.displayAsNomination = function(){
    
    AllNominations.add(new Movie(this.Title,  this.Year, this.imdbID, this.Poster));
            
    const nominatedMovieList = document.getElementById('nominatedMovieList');
    const helpMessage = document.getElementById('helpMessage');

    helpMessage.hide();
    nominatedMovieList.show();

    const nominatedMovieComponent = document.getElementById('nominatedMovieComponent');
    const node = document.importNode(nominatedMovieComponent.content, true);

    const movieTitleAndYear = node.querySelector('li');
    const removeNominationButton = node.querySelector('a');


    movieTitleAndYear.setAttribute('id', this.imdbID);
    movieTitleAndYear.innerText = `${this.Title} (${this.Year})`

    removeNominationButton.setAttribute('id', `${this.imdbID}-remove`);

    nominatedMovieList.appendChild(node);

    this.bindRemoveButton();

    if(AllNominations.count() >= maxNominations) {
        document.getElementById('nominationsCompleteNotice').show();
        displayShareableLink();
    }

}

Movie.prototype.bindRemoveButton = async function(){
    let removeNominationBtn = document.getElementById(`${this.imdbID}-remove`);
    removeNominationBtn.addEventListener('click', () => {
        AllNominations.remove(this.imdbID);
        nominatedMovieList.removeChild(document.getElementById(`${this.imdbID}`)); // remove the title
        nominatedMovieList.removeChild(document.getElementById(`${this.imdbID}-remove`)); // remove the titles REMOVE button

        this.enableNominationButton();

        if (AllNominations.isEmpty()) helpMessage.show();
    });
}


Movie.prototype.enableNominationButton = function(){
    let nominationBtn = document.getElementById(`${this.imdbID}-add`);
    // may or may not exist since users can visit using a shareable link
    if(nominationBtn) nominationBtn.enable();
}