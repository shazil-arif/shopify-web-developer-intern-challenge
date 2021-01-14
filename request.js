// https://www.omdbapi.com/?s=MOVIENAME&apikey=fdf22c9a

/**
 * @function fetchMovieFromAPI simple function to get data from the OMDB API
 * @param {string} movieTitle the movie title to search for
 */
async function fetchMovieFromAPI(movieTitle){
    const apikey = 'fdf22c9a';
    const titleQueryParameter = `s=${movieTitle}`;
    const apiKeyQueryParameter = `apiKey=${apikey}`
    const URL = `https://www.omdbapi.com/?${titleQueryParameter}&${apiKeyQueryParameter}`;
    let data = await fetch(URL)
    data = await data.json();
    return data.Search;    
}

