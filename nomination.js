HTMLElement.prototype.inputIsEmpty = function(){
    return this.textContent.trim().length === 0;
}
HTMLElement.prototype.hide = function(){
    this.style.display = 'none';
}
HTMLElement.prototype.show = function(){
    this.style.display = 'block'
}

function fetchMovieFromAPI(movieTitle){

}

window.onload = function(){
    const searchBtn = document.getElementById('searchBtn');
    const movieSeachNameInput = document.getElementById('movieSearchNameInput');
    const alertField = document.getElementById('enterTitleAlert')
    const movieTitle = movieSeachNameInput.textContent;


    // this is so that we can hide the alert message incase it was previously shown
    movieSeachNameInput.addEventListener('keyup', () => {
        alertField.hide();
    });

    searchBtn.addEventListener('click', () => {
        if(movieSeachNameInput.inputIsEmpty()){
            alertField.show();
        }
        else{
            // show spinner
            fetchMovieFromAPI(movieTitle);
        }
    });
}