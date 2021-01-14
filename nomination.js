
/**
 * @constructor a simple and efficient Data structure to maintain a list of current nominations. 
 * This is actually redundant for the basic requirements but necessary if we want to save items
 * once a user leaves a page and to generate shareable links
 * 
 * Uses a simply key value mapping between a movies imdbId and a Movie object
 * makes it simple to add and remove movie objects using the imdbId
 */
function Nominations(){
    this.movies = {};
    this.size = 0;
}

// O(1) for all operations except getMovies

/**
 * @function add add a Movie object to list of nominations
 * @param {Movie} movie a Movie object, class definition can be found in the Movie.js file
 */
Nominations.prototype.add = function(movie){
    this.movies[movie.imdbID] = movie;
    this.size++;
}

/**
 * @function add remove a Movie object from list of nominations
 * @param {string} imdbID a imdbID string
 */
Nominations.prototype.remove = function(imdbID){
    delete this.movies[imdbID];
    this.size--;
}

// get the number of nominations
Nominations.prototype.count = function(){
    return this.size;
}

// simple helper to check if no nominations to clean up some code in other parts
Nominations.prototype.isEmpty = function (){
    return this.size === 0;
}
// to support iteration, alternative: ES6 iterators but may not be supported in some older browsers
// O(n) where n is the number of movies. however, n will be 5 at most
Nominations.prototype.getMovies = function (){
    let nominations = [];
    for(const key in this.movies){
        nominations.push(this.movies[key]);
    }
    return nominations;
}