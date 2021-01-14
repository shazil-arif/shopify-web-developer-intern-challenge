
/**
 * @function userIsVisitingWithShareableLink helper function to check if a user visited the web page with a shareable lnk
 */
function userIsVisitingWithShareableLink(){

    // can simply check if query string was present
    let queryString = window.location.search;
    return queryString.length > 0;
}

/**
 * @function parseMovieTitlesFromQueryParameters extract the movie info if a user is visiting using a shareable link
 */
function parseMovieTitlesFromQueryParameters(){
    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    let queryParams = window.location.search.split('&');
    queryParams[0] = queryParams[0].replace('?', ''); // the first parameter will have a ? at the start so remove it
    for(const queryParam of queryParams){

        // sometimes '&' is present at the end with no additional value so check if empty first
        if(queryParam.length > 0){
            const movieInfo = queryParam.split('-');

            const movieTitle = movieInfo[0];
            const movieYear = movieInfo[1];
            const movieimdbID = movieInfo[2];
    
            // replaceAll occurences of %20 that shows up due to spaces in the query string
            const movie = new Movie(movieTitle.replaceAll('%20', ' '), movieYear,  movieimdbID, ''); // don't need the poster in this case
    
            movie.displayAsNomination(); // display the nomination to the UI!
        }
    }
}


/**
 * @function createShareableLink generate a shareable link using query parameters
 */
function createShareableLink(){
    let queryString = '?';

    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     * each Movie object has a uniqueIdentifier field that follows the above format
     */
    for(const Movie of AllNominations.getMovies()){
        // keep appending the uniqueIdentifier with a & symbol
        let queryParameter = Movie.uniqueIdentifier;
        queryString += queryParameter;
        queryString += '&';
    }

    return window.location + queryString;
}

// display the shareable link to the UI
function displayShareableLink(){
    const shareableLink = createShareableLink();
    let shareableLinkAnchorTag = document.getElementById('shareableLinkAnchorTag');
    shareableLinkAnchorTag.setAttribute('href', shareableLink);
    shareableLinkAnchorTag.innerHTML = shareableLink;
}
