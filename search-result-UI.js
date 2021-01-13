function listMovieSarchResults(movies){
  
    document.getElementById('searchResultsContainer').show();
    document.getElementById('resultsTitle').show();

    for(let i = 0; i < movies.length; i++){
        let currentRowNumber = i;
        if(currentRowIsFull(currentRowNumber)){
            insertNewRow();
        }
        
        const currentMovie = new Movie(movies[i].Title, movies[i].Year, movies[i].imdbID, movies[i].Poster);
        currentMovie.displayAsSearchResult(i);
    }
}

function currentRowIsFull(rowNumber){
    return rowNumber % movieResultsPerRow === 0;
}

function insertNewRow(){
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const row = document.getElementById('cardViewRowComponent');
    let rowComponent = document.importNode(row.content, true);
    searchResultsContainer.appendChild(rowComponent);
}