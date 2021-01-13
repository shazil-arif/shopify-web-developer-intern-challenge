// http://www.omdbapi.com/?s=MOVIENAME&apikey=fdf22c9a
async function fetchMovieFromAPI(movieTitle){
    const apikey = 'fdf22c9a';
    const titleQueryParameter = `s=${movieTitle}`;
    const apiKeyQueryParameter = `apiKey=${apikey}`
    const URL = `http://www.omdbapi.com/?${titleQueryParameter}&${apiKeyQueryParameter}`;
    let data = await fetch(URL)
    data = await data.json();
    return data.Search;    
}

