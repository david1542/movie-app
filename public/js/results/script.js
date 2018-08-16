function pageTool() {
    this.shouldClearSuggestion = true;
}

const activePageTool = new pageTool();

// Initiate event listeners
window.onload = function() {
    activePageTool.initiateEventListeners();
}

activePageTool.createMovieSuggestionItem = function(movie) {
    const suggestion = document.createElement('div');
    suggestion.classList = 'suggestion-item';

    suggestion.innerText = movie.title;
    return suggestion;
}

activePageTool.createMovieListItem = function(movie) {
     // Create movie container
     const cardBody = document.createElement('div');
     cardBody.classList = 'card-body';

      // Create movie img tag
     const movieImg = document.createElement('img');
     movieImg.src = movie.poster;
     movieImg.onerror = function() {
          movieImg.error = null;
          movieImg.src='images/default.jpg';
     }
     movieImg.classList = 'movie-img'

      // Create details container
     const detailsContainer = document.createElement('div');
     detailsContainer.classList = 'h-100 w-100 movie-body';

      // Movie title
     const title = document.createElement('h4');
     title.classList = 'movie-title text-white';
     title.innerText = movie.title;

      // Movie release date
     const date = document.createElement('h4');
     date.classList = 'movie-text text-white';
     date.innerText = movie.release_date;

      // Explore more button           
     const link = document.createElement('a');
     link.classList = 'btn btn-danger explore';
     link.href = '/' + movie.id;
     link.innerText = 'Explore More!';

      // Appendings
     detailsContainer.appendChild(title);
     detailsContainer.appendChild(date);
     detailsContainer.appendChild(link);

      // Append all childs to the main container
     cardBody.appendChild(movieImg);
     cardBody.appendChild(detailsContainer);

     return cardBody;
}

activePageTool.initiateEventListeners = function() {
    document.getElementById('movieTerm').addEventListener('input', function(e) {
        document.querySelector('.loader-container').classList.add('flex');
        document.querySelector('.movie-list').classList.add('hidden');

        const query = e.target.value;

        document.querySelector('.query > h3').innerText = 'Results for term: ' + query;
        const request = fetch('/search?term=' + query);

        fetch(activeMainTool.serverSrc + '/search?term=' + query).then(function(res) {
            if(res.ok) {
                return res.json();
            } else {
                throw new Error({
                    status: res.status,
                    message: 'Error'
                })
            }
        }).then(function(data) {
            const movieList = document.querySelector('.movie-list');
            const suggestionsItems = document.querySelector('.autocomplete-items');
            
            movieList.innerHTML = '';
            suggestionsItems.innerHTML = '';

            const movies = data.movies;
            
            movies.forEach(function(movie) {
            const cardBody = activePageTool.createMovieListItem(movie);
            const suggestion = activePageTool.createMovieSuggestionItem(movie);

            movieList.appendChild(cardBody);
            suggestionsItems.appendChild(suggestion);
            });

            document.querySelector('.loader-container').classList.remove('flex');
            document.querySelector('.movie-list').classList.remove('hidden');        
        }).catch(function(err) {
            console.log(err);
        });
    });

    document.querySelector('.autocomplete-items').addEventListener('click', function(e) {
        const movieTitle = e.target.outerText;

        const movieSearch = document.getElementById('movieTerm');
        movieSearch.value = movieTitle;

        // Triggering input event    
        if (document.createEvent) {
            movieSearch.dispatchEvent(new Event('input'));
        } else {
            movieSearch.fireEvent('input');
        }

        this.classList = 'autocomplete-items hidden';
    });

    document.querySelector('.autocomplete-items').addEventListener('mouseenter', function() {
        activePageTool.shouldClearSuggestion = false;
    });

    document.querySelector('.autocomplete-items').addEventListener('mouseleave', function() {
        activePageTool.shouldClearSuggestion = true;
    });

    document.getElementById('movieTerm').addEventListener('focus', function(e) {
        const suggestionsItems = document.querySelector('.autocomplete-items');

        suggestionItems.classList = 'autocomplete-items visible';
    });

    document.getElementById('movieTerm').addEventListener('focusout', function(e) {
        const suggestionsItems = document.querySelector('.autocomplete-items');

        if(activePageTool.shouldClearSuggestion) {
            suggestionItems.classList = 'autocomplete-items hidden';
        }
    });
}