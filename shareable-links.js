
function userIsVisitingWithShareableLink(){
    let queryString = window.location.search;
    return queryString.length > 0;
}

function parseMovieTitlesFromQueryParameters(){
    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    let queryParams = window.location.search.split('&');
    queryParams[0] = queryParams[0].replace('?', '');
    for(const queryParam of queryParams){

        // sometimes '&' is present at the end with no additional value
        if(queryParam.length > 0){
            const movieInfo = queryParam.split('-');

            const movieTitle = movieInfo[0];
            const movieYear = movieInfo[1];
            const movieimdbID = movieInfo[2];
    
            const movie = new Movie(movieTitle.replaceAll('%20', ' '), movieYear,  movieimdbID, ''); // don't need the poster
    
            movie.displayAsNomination();
        }
    }
}


function createShareableLink(){
    let queryString = '?';

    /**
     * Query Parameter Format:
     * 'Title-Year-imdbID'
     */
    for(const Movie of AllNominations.getMovies()){
        let queryParameter = Movie.uniqueIdentifier;
        queryString += queryParameter;
        queryString += '&';
    }

    return window.location + queryString;
}

function displayShareableLink(){
    const shareableLink = createShareableLink();
    let shareableLinkAnchorTag = document.getElementById('shareableLinkAnchorTag');
    shareableLinkAnchorTag.setAttribute('href', shareableLink);
    shareableLinkAnchorTag.innerHTML = shareableLink;
}
