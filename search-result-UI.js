const movieResultsPerRow = 3; // adjustable constant to make changes to the UI presentation and number of search results per row

/**
 * @function listMovieSarchResults display movie search results on the UI after getting the data from the OMDB API
 * @param {Array<Object>} movies array of objects containing OMDB movie data
 */
function listMovieSarchResults(movies){
  
    let searchResultsContainer = document.getElementById('mainContainer'); // main component to display search results in
    const resultsTitle = document.getElementById('resultsTitle');
    
    searchResultsContainer.setAutoWidth(); // change the width to auto so it can adjust when pictures are loaded in
    searchResultsContainer.show();

    // the title for the searchResults container
    resultsTitle.show();

    for(let i = 0; i < movies.length; i++){
        let currentRowNumber = i;

        // check if the current card view row is full, if so insert a new one
        // implementation is buried in helpers so you can think less about whats happening 
        if(currentRowIsFull(currentRowNumber)){
            insertNewRow();
        }
        
        const currentMovie = new Movie(movies[i].Title, movies[i].Year, movies[i].imdbID, movies[i].Poster);
        currentMovie.displayAsSearchResult(i);
    }
}

// if current rowNumber is a multiple of the number of results we want to show per row, then this current row is full,
function currentRowIsFull(rowNumber){
    return rowNumber % movieResultsPerRow === 0;
}

// helper to insert new row
function insertNewRow(){

    // import the resuable row template component and add to the document
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const row = document.getElementById('cardViewRowComponent');
    let rowComponent = document.importNode(row.content, true);
    searchResultsContainer.appendChild(rowComponent);
}